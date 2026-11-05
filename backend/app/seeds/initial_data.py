from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified
from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models import (
    User, Cooperative, UserRole,
    Sector, SubSector,
    Cluster, Module, ClusterCode, ModuleCategory,
    DiagnosticSubmission, DiagnosticStatus
)
from app.services.scoring_engine import ScoringEngine

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        # 1. Seed Clusters (The 6 Archetypes from Slide 57)
        clusters_data = [
            {
                "code": ClusterCode.ARTISANAL_TRADITIONNEL,
                "name": "Artisanal traditionnel",
                "tagline": "Savoir-faire manuel et valorisation du patrimoine",
                "description": "Coopératives reposant principalement sur des procédés manuels, un outillage traditionnel et une faible intensité capitalistique.",
                "color_code": "#8B5CF6",
                "icon": "Hammer",
                "order_index": 1
            },
            {
                "code": ClusterCode.TRANSFORMATION_LEGERE,
                "name": "Transformation légère",
                "tagline": "Conditionnement et valorisation semi-mécanisée",
                "description": "Coopératives opérant une transformation primaire ou un conditionnement avec des équipements intermédiaires.",
                "color_code": "#10B981",
                "icon": "Leaf",
                "order_index": 2
            },
            {
                "code": ClusterCode.PRODUCTION_MECANISEE,
                "name": "Production mécanisée",
                "tagline": "Équipements automatisés et cadences régulières",
                "description": "Coopératives dotées de lignes mécanisées, avec un besoin fort en maintenance et en efficacité énergétique.",
                "color_code": "#3B82F6",
                "icon": "Cpu",
                "order_index": 3
            },
            {
                "code": ClusterCode.INDUSTRIEL_EXTRACTIF,
                "name": "Industriel / Extractif",
                "tagline": "Haute capacité technique et volumes importants",
                "description": "Unités à forte intensité énergétique et processus industriels lourds (presses industrielles, minoteries, extraction continue).",
                "color_code": "#F59E0B",
                "icon": "Factory",
                "order_index": 4
            },
            {
                "code": ClusterCode.SERVICES_ORGANISES,
                "name": "Services organisés",
                "tagline": "Prestations structurées, logistique et accueil",
                "description": "Coopératives axées sur la logistique, l'écotourisme ou les services collectifs.",
                "color_code": "#06B6D4",
                "icon": "Truck",
                "order_index": 5
            },
            {
                "code": ClusterCode.SERVICES_COGNITIFS,
                "name": "Services cognitifs & numériques",
                "tagline": "Ingénierie, conseil et commerce digital",
                "description": "Coopératives de services intellectuels, gestion, e-commerce ou solutions numériques.",
                "color_code": "#6366F1",
                "icon": "Laptop",
                "order_index": 6
            },
        ]

        created_clusters = {}
        for c_data in clusters_data:
            existing = db.query(Cluster).filter(Cluster.code == c_data["code"]).first()
            if not existing:
                c = Cluster(**c_data)
                db.add(c)
                db.flush()
                created_clusters[c.code] = c
            else:
                created_clusters[existing.code] = existing

        # 2. Seed ODCO Sectors and Sub-Sectors (from Slide 58)
        sectors_data = [
            {
                "code": "AGR",
                "name": "Agriculture",
                "order_index": 1,
                "sub_sectors": [
                    {"code": "AGR_01", "name": "Céréales et légumineuses", "order_index": 1},
                    {"code": "AGR_02", "name": "Maraîchage", "order_index": 2},
                    {"code": "AGR_03", "name": "Arboriculture fruitière", "order_index": 3},
                    {"code": "AGR_04", "name": "Oléiculture", "order_index": 4},
                    {"code": "AGR_05", "name": "Agrumes", "order_index": 5},
                    {"code": "AGR_06", "name": "Viticulture", "order_index": 6},
                    {"code": "AGR_07", "name": "Élevage bovin", "order_index": 7},
                    {"code": "AGR_08", "name": "Élevage ovin et caprin", "order_index": 8},
                    {"code": "AGR_09", "name": "Aviculture", "order_index": 9},
                    {"code": "AGR_10", "name": "Apiculture", "order_index": 10},
                    {"code": "AGR_11", "name": "Production laitière", "order_index": 11},
                    {"code": "AGR_12", "name": "Semences et plants", "order_index": 12},
                    {"code": "AGR_13", "name": "Irrigation et services agricoles", "order_index": 13},
                    {"code": "AGR_14", "name": "Autre – à préciser", "order_index": 14},
                ]
            },
            {
                "code": "ART",
                "name": "Artisanat",
                "order_index": 2,
                "sub_sectors": [
                    {"code": "ART_01", "name": "Tissage et textile", "order_index": 1},
                    {"code": "ART_02", "name": "Tapis", "order_index": 2},
                    {"code": "ART_03", "name": "Broderie et couture", "order_index": 3},
                    {"code": "ART_04", "name": "Cuir et maroquinerie", "order_index": 4},
                    {"code": "ART_05", "name": "Poterie et céramique", "order_index": 5},
                    {"code": "ART_06", "name": "Bois et menuiserie", "order_index": 6},
                    {"code": "ART_07", "name": "Vannerie", "order_index": 7},
                    {"code": "ART_08", "name": "Ferronnerie", "order_index": 8},
                    {"code": "ART_09", "name": "Bijouterie", "order_index": 9},
                    {"code": "ART_10", "name": "Zellige et mosaïque", "order_index": 10},
                    {"code": "ART_11", "name": "Décoration", "order_index": 11},
                    {"code": "ART_12", "name": "Produits artisanaux divers", "order_index": 12},
                    {"code": "ART_13", "name": "Autre – à préciser", "order_index": 13},
                ]
            },
            {
                "code": "CDT",
                "name": "Commerçants détaillants",
                "order_index": 3,
                "sub_sectors": [
                    {"code": "CDT_01", "name": "Alimentation générale", "order_index": 1},
                    {"code": "CDT_02", "name": "Fruits et légumes", "order_index": 2},
                    {"code": "CDT_03", "name": "Habillement", "order_index": 3},
                    {"code": "CDT_04", "name": "Produits artisanaux", "order_index": 4},
                    {"code": "CDT_05", "name": "Produits agricoles", "order_index": 5},
                    {"code": "CDT_06", "name": "Équipements et fournitures", "order_index": 6},
                    {"code": "CDT_07", "name": "Commerce de proximité", "order_index": 7},
                    {"code": "CDT_08", "name": "Marchés et points de vente collectifs", "order_index": 8},
                    {"code": "CDT_09", "name": "Autre – à préciser", "order_index": 9},
                ]
            },
            {
                "code": "PAM",
                "name": "Plantes aromatiques et médicinales",
                "order_index": 4,
                "sub_sectors": [
                    {"code": "PAM_01", "name": "Culture des plantes", "order_index": 1},
                    {"code": "PAM_02", "name": "Collecte", "order_index": 2},
                    {"code": "PAM_03", "name": "Séchage", "order_index": 3},
                    {"code": "PAM_04", "name": "Distillation", "order_index": 4},
                    {"code": "PAM_05", "name": "Huiles essentielles", "order_index": 5},
                    {"code": "PAM_06", "name": "Hydrolats", "order_index": 6},
                    {"code": "PAM_07", "name": "Herboristerie", "order_index": 7},
                    {"code": "PAM_08", "name": "Tisanes", "order_index": 8},
                    {"code": "PAM_09", "name": "Extraits naturels", "order_index": 9},
                    {"code": "PAM_10", "name": "Conditionnement et commercialisation", "order_index": 10},
                    {"code": "PAM_11", "name": "Autre – à préciser", "order_index": 11},
                ]
            },
            {
                "code": "HAB",
                "name": "Habitat",
                "order_index": 5,
                "sub_sectors": [
                    {"code": "HAB_01", "name": "Construction de logements", "order_index": 1},
                    {"code": "HAB_02", "name": "Acquisition de terrains", "order_index": 2},
                    {"code": "HAB_03", "name": "Lotissement", "order_index": 3},
                    {"code": "HAB_04", "name": "Habitat économique", "order_index": 4},
                    {"code": "HAB_05", "name": "Habitat rural", "order_index": 5},
                    {"code": "HAB_06", "name": "Rénovation", "order_index": 6},
                    {"code": "HAB_07", "name": "Gestion et entretien des résidences", "order_index": 7},
                    {"code": "HAB_08", "name": "Autre – à préciser", "order_index": 8},
                ]
            },
            {
                "code": "ARG",
                "name": "Argan",
                "order_index": 6,
                "sub_sectors": [
                    {"code": "ARG_01", "name": "Collecte des fruits", "order_index": 1},
                    {"code": "ARG_02", "name": "Concassage", "order_index": 2},
                    {"code": "ARG_03", "name": "Extraction d’huile alimentaire", "order_index": 3},
                    {"code": "ARG_04", "name": "Extraction d’huile cosmétique", "order_index": 4},
                    {"code": "ARG_05", "name": "Produits cosmétiques", "order_index": 5},
                    {"code": "ARG_06", "name": "Produits alimentaires à base d’argan", "order_index": 6},
                    {"code": "ARG_07", "name": "Conditionnement et commercialisation", "order_index": 7},
                    {"code": "ARG_08", "name": "Autre – à préciser", "order_index": 8},
                ]
            },
            {
                "code": "EDU",
                "name": "Éducation et enseignement",
                "order_index": 7,
                "sub_sectors": [
                    {"code": "EDU_01", "name": "Enseignement préscolaire", "order_index": 1},
                    {"code": "EDU_02", "name": "Enseignement scolaire", "order_index": 2},
                    {"code": "EDU_03", "name": "Alphabétisation", "order_index": 3},
                    {"code": "EDU_04", "name": "Formation professionnelle", "order_index": 4},
                    {"code": "EDU_05", "name": "Soutien scolaire", "order_index": 5},
                    {"code": "EDU_06", "name": "Formation linguistique", "order_index": 6},
                    {"code": "EDU_07", "name": "Formation numérique", "order_index": 7},
                    {"code": "EDU_08", "name": "Éducation spécialisée", "order_index": 8},
                    {"code": "EDU_09", "name": "Formation à distance", "order_index": 9},
                    {"code": "EDU_10", "name": "Autre – à préciser", "order_index": 10},
                ]
            },
            {
                "code": "DAL",
                "name": "Denrées alimentaires",
                "order_index": 8,
                "sub_sectors": [
                    {"code": "DAL_01", "name": "Transformation des céréales", "order_index": 1},
                    {"code": "DAL_02", "name": "Boulangerie et pâtisserie", "order_index": 2},
                    {"code": "DAL_03", "name": "Couscous et pâtes", "order_index": 3},
                    {"code": "DAL_04", "name": "Transformation des fruits et légumes", "order_index": 4},
                    {"code": "DAL_05", "name": "Confitures", "order_index": 5},
                    {"code": "DAL_06", "name": "Conserverie", "order_index": 6},
                    {"code": "DAL_07", "name": "Produits laitiers", "order_index": 7},
                    {"code": "DAL_08", "name": "Transformation des viandes", "order_index": 8},
                    {"code": "DAL_09", "name": "Épices et condiments", "order_index": 9},
                    {"code": "DAL_10", "name": "Boissons", "order_index": 10},
                    {"code": "DAL_11", "name": "Produits du terroir", "order_index": 11},
                    {"code": "DAL_12", "name": "Autre – à préciser", "order_index": 12},
                ]
            },
            {
                "code": "TOU",
                "name": "Tourisme",
                "order_index": 9,
                "sub_sectors": [
                    {"code": "TOU_01", "name": "Hébergement rural", "order_index": 1},
                    {"code": "TOU_02", "name": "Maisons d’hôtes", "order_index": 2},
                    {"code": "TOU_03", "name": "Restauration", "order_index": 3},
                    {"code": "TOU_04", "name": "Circuits touristiques", "order_index": 4},
                    {"code": "TOU_05", "name": "Guides et accompagnement", "order_index": 5},
                    {"code": "TOU_06", "name": "Écotourisme", "order_index": 6},
                    {"code": "TOU_07", "name": "Tourisme culturel", "order_index": 7},
                    {"code": "TOU_08", "name": "Tourisme solidaire", "order_index": 8},
                    {"code": "TOU_09", "name": "Animation touristique", "order_index": 9},
                    {"code": "TOU_10", "name": "Transport touristique", "order_index": 10},
                    {"code": "TOU_11", "name": "Autre – à préciser", "order_index": 11},
                ]
            },
            {
                "code": "PEC",
                "name": "Pêche maritime",
                "order_index": 10,
                "sub_sectors": [
                    {"code": "PEC_01", "name": "Pêche artisanale", "order_index": 1},
                    {"code": "PEC_02", "name": "Pêche côtière", "order_index": 2},
                    {"code": "PEC_03", "name": "Aquaculture", "order_index": 3},
                    {"code": "PEC_04", "name": "Collecte des produits marins", "order_index": 4},
                    {"code": "PEC_05", "name": "Mareyage", "order_index": 5},
                    {"code": "PEC_06", "name": "Transformation et conservation", "order_index": 6},
                    {"code": "PEC_07", "name": "Fabrication et entretien des filets", "order_index": 7},
                    {"code": "PEC_08", "name": "Services aux pêcheurs", "order_index": 8},
                    {"code": "PEC_09", "name": "Autre – à préciser", "order_index": 9},
                ]
            },
            {
                "code": "CAN",
                "name": "Cannabis",
                "order_index": 11,
                "sub_sectors": [
                    {"code": "CAN_01", "name": "Culture autorisée", "order_index": 1},
                    {"code": "CAN_02", "name": "Production de semences et plants", "order_index": 2},
                    {"code": "CAN_03", "name": "Collecte", "order_index": 3},
                    {"code": "CAN_04", "name": "Transformation industrielle", "order_index": 4},
                    {"code": "CAN_05", "name": "Usages médicaux", "order_index": 5},
                    {"code": "CAN_06", "name": "Usages pharmaceutiques", "order_index": 6},
                    {"code": "CAN_07", "name": "Usages cosmétiques", "order_index": 7},
                    {"code": "CAN_08", "name": "Valorisation des fibres", "order_index": 8},
                    {"code": "CAN_09", "name": "Commercialisation réglementée", "order_index": 9},
                    {"code": "CAN_10", "name": "Autre – à préciser", "order_index": 10},
                ]
            },
            {
                "code": "FOR",
                "name": "Forêt",
                "order_index": 12,
                "sub_sectors": [
                    {"code": "FOR_01", "name": "Exploitation du bois", "order_index": 1},
                    {"code": "FOR_02", "name": "Collecte du bois mort", "order_index": 2},
                    {"code": "FOR_03", "name": "Pépinières forestières", "order_index": 3},
                    {"code": "FOR_04", "name": "Reboisement", "order_index": 4},
                    {"code": "FOR_05", "name": "Collecte des champignons", "order_index": 5},
                    {"code": "FOR_06", "name": "Collecte des plantes sauvages", "order_index": 6},
                    {"code": "FOR_07", "name": "Liège", "order_index": 7},
                    {"code": "FOR_08", "name": "Résines", "order_index": 8},
                    {"code": "FOR_09", "name": "Produits forestiers non ligneux", "order_index": 9},
                    {"code": "FOR_10", "name": "Autre – à préciser", "order_index": 10},
                ]
            },
            {
                "code": "SER",
                "name": "Prestation de services",
                "order_index": 13,
                "sub_sectors": [
                    {"code": "SER_01", "name": "Nettoyage", "order_index": 1},
                    {"code": "SER_02", "name": "Gardiennage", "order_index": 2},
                    {"code": "SER_03", "name": "Entretien des espaces verts", "order_index": 3},
                    {"code": "SER_04", "name": "Restauration collective", "order_index": 4},
                    {"code": "SER_05", "name": "Organisation d’événements", "order_index": 5},
                    {"code": "SER_06", "name": "Services administratifs", "order_index": 6},
                    {"code": "SER_07", "name": "Services informatiques", "order_index": 7},
                    {"code": "SER_08", "name": "Réparation et maintenance", "order_index": 8},
                    {"code": "SER_09", "name": "Services à la personne", "order_index": 9},
                    {"code": "SER_10", "name": "Livraison", "order_index": 10},
                    {"code": "SER_11", "name": "Autre – à préciser", "order_index": 11},
                ]
            },
            {
                "code": "REC",
                "name": "Traitement et recyclage des déchets",
                "order_index": 14,
                "sub_sectors": [
                    {"code": "REC_01", "name": "Collecte et tri", "order_index": 1},
                    {"code": "REC_02", "name": "Recyclage du plastique", "order_index": 2},
                    {"code": "REC_03", "name": "Papier et carton", "order_index": 3},
                    {"code": "REC_04", "name": "Verre", "order_index": 4},
                    {"code": "REC_05", "name": "Métaux", "order_index": 5},
                    {"code": "REC_06", "name": "Textile", "order_index": 6},
                    {"code": "REC_07", "name": "Déchets électroniques", "order_index": 7},
                    {"code": "REC_08", "name": "Déchets organiques", "order_index": 8},
                    {"code": "REC_09", "name": "Compostage", "order_index": 9},
                    {"code": "REC_10", "name": "Valorisation des déchets agricoles", "order_index": 10},
                    {"code": "REC_11", "name": "Autre – à préciser", "order_index": 11},
                ]
            },
            {
                "code": "MDO",
                "name": "Main-d’œuvre",
                "order_index": 15,
                "sub_sectors": [
                    {"code": "MDO_01", "name": "Main-d’œuvre agricole", "order_index": 1},
                    {"code": "MDO_02", "name": "Ouvriers du bâtiment", "order_index": 2},
                    {"code": "MDO_03", "name": "Manutention", "order_index": 3},
                    {"code": "MDO_04", "name": "Chargement et déchargement", "order_index": 4},
                    {"code": "MDO_05", "name": "Nettoyage", "order_index": 5},
                    {"code": "MDO_06", "name": "Entretien", "order_index": 6},
                    {"code": "MDO_07", "name": "Travaux saisonniers", "order_index": 7},
                    {"code": "MDO_08", "name": "Services techniques mutualisés", "order_index": 8},
                    {"code": "MDO_09", "name": "Autre – à préciser", "order_index": 9},
                ]
            },
            {
                "code": "TRA",
                "name": "Transport",
                "order_index": 16,
                "sub_sectors": [
                    {"code": "TRA_01", "name": "Transport de personnes", "order_index": 1},
                    {"code": "TRA_02", "name": "Transport scolaire", "order_index": 2},
                    {"code": "TRA_03", "name": "Transport du personnel", "order_index": 3},
                    {"code": "TRA_04", "name": "Transport rural", "order_index": 4},
                    {"code": "TRA_05", "name": "Transport de marchandises", "order_index": 5},
                    {"code": "TRA_06", "name": "Livraison et distribution", "order_index": 6},
                    {"code": "TRA_07", "name": "Transport frigorifique", "order_index": 7},
                    {"code": "TRA_08", "name": "Logistique", "order_index": 8},
                    {"code": "TRA_09", "name": "Autre – à préciser", "order_index": 9},
                ]
            },
            {
                "code": "IMP",
                "name": "Imprimerie",
                "order_index": 17,
                "sub_sectors": [
                    {"code": "IMP_01", "name": "Impression numérique", "order_index": 1},
                    {"code": "IMP_02", "name": "Impression offset", "order_index": 2},
                    {"code": "IMP_03", "name": "Sérigraphie", "order_index": 3},
                    {"code": "IMP_04", "name": "Papeterie", "order_index": 4},
                    {"code": "IMP_05", "name": "Reliure", "order_index": 5},
                    {"code": "IMP_06", "name": "Emballage", "order_index": 6},
                    {"code": "IMP_07", "name": "Étiquetage", "order_index": 7},
                    {"code": "IMP_08", "name": "Signalétique", "order_index": 8},
                    {"code": "IMP_09", "name": "Conception graphique", "order_index": 9},
                    {"code": "IMP_10", "name": "Autre – à préciser", "order_index": 10},
                ]
            },
            {
                "code": "ACU",
                "name": "Art et culture",
                "order_index": 18,
                "sub_sectors": [
                    {"code": "ACU_01", "name": "Arts plastiques", "order_index": 1},
                    {"code": "ACU_02", "name": "Musique", "order_index": 2},
                    {"code": "ACU_03", "name": "Théâtre", "order_index": 3},
                    {"code": "ACU_04", "name": "Cinéma et audiovisuel", "order_index": 4},
                    {"code": "ACU_05", "name": "Photographie", "order_index": 5},
                    {"code": "ACU_06", "name": "Danse", "order_index": 6},
                    {"code": "ACU_07", "name": "Patrimoine culturel", "order_index": 7},
                    {"code": "ACU_08", "name": "Édition", "order_index": 8},
                    {"code": "ACU_09", "name": "Production culturelle", "order_index": 9},
                    {"code": "ACU_10", "name": "Événements et festivals", "order_index": 10},
                    {"code": "ACU_11", "name": "Industries créatives", "order_index": 11},
                    {"code": "ACU_12", "name": "Autre – à préciser", "order_index": 12},
                ]
            },
            {
                "code": "CAR",
                "name": "Exploitation des carrières",
                "order_index": 19,
                "sub_sectors": [
                    {"code": "CAR_01", "name": "Pierre", "order_index": 1},
                    {"code": "CAR_02", "name": "Marbre", "order_index": 2},
                    {"code": "CAR_03", "name": "Sable", "order_index": 3},
                    {"code": "CAR_04", "name": "Gravier", "order_index": 4},
                    {"code": "CAR_05", "name": "Argile", "order_index": 5},
                    {"code": "CAR_06", "name": "Gypse", "order_index": 6},
                    {"code": "CAR_07", "name": "Concassage", "order_index": 7},
                    {"code": "CAR_08", "name": "Taille et transformation de pierre", "order_index": 8},
                    {"code": "CAR_09", "name": "Valorisation des matériaux", "order_index": 9},
                    {"code": "CAR_10", "name": "Autre – à préciser", "order_index": 10},
                ]
            },
            {
                "code": "COG",
                "name": "Conseil et gestion",
                "order_index": 20,
                "sub_sectors": [
                    {"code": "COG_01", "name": "Conseil en gestion", "order_index": 1},
                    {"code": "COG_02", "name": "Comptabilité", "order_index": 2},
                    {"code": "COG_03", "name": "Accompagnement juridique", "order_index": 3},
                    {"code": "COG_04", "name": "Études et ingénierie", "order_index": 4},
                    {"code": "COG_05", "name": "Conseil agricole", "order_index": 5},
                    {"code": "COG_06", "name": "Marketing et communication", "order_index": 6},
                    {"code": "COG_07", "name": "Gestion de projets", "order_index": 7},
                    {"code": "COG_08", "name": "Formation et accompagnement entrepreneurial", "order_index": 8},
                    {"code": "COG_09", "name": "Autre – à préciser", "order_index": 9},
                ]
            },
            {
                "code": "ECE",
                "name": "Commerce électronique",
                "order_index": 21,
                "sub_sectors": [
                    {"code": "ECE_01", "name": "Vente de produits agricoles", "order_index": 1},
                    {"code": "ECE_02", "name": "Vente de produits artisanaux", "order_index": 2},
                    {"code": "ECE_03", "name": "Place de marché (marketplace)", "order_index": 3},
                    {"code": "ECE_04", "name": "Gestion de boutiques en ligne", "order_index": 4},
                    {"code": "ECE_05", "name": "Livraison liée au commerce électronique", "order_index": 5},
                    {"code": "ECE_06", "name": "Marketing numérique", "order_index": 6},
                    {"code": "ECE_07", "name": "Paiement et gestion des commandes", "order_index": 7},
                    {"code": "ECE_08", "name": "Autre – à préciser", "order_index": 8},
                ]
            },
            {
                "code": "TEL",
                "name": "Télécommunication",
                "order_index": 22,
                "sub_sectors": [
                    {"code": "TEL_01", "name": "Installation de réseaux", "order_index": 1},
                    {"code": "TEL_02", "name": "Fibre optique", "order_index": 2},
                    {"code": "TEL_03", "name": "Maintenance télécom", "order_index": 3},
                    {"code": "TEL_04", "name": "Services Internet", "order_index": 4},
                    {"code": "TEL_05", "name": "Centres d’appels", "order_index": 5},
                    {"code": "TEL_06", "name": "Installation d’antennes", "order_index": 6},
                    {"code": "TEL_07", "name": "Solutions numériques et connectivité", "order_index": 7},
                    {"code": "TEL_08", "name": "Autre – à préciser", "order_index": 8},
                ]
            },
            {
                "code": "MIN",
                "name": "Mines",
                "order_index": 23,
                "sub_sectors": [
                    {"code": "MIN_01", "name": "Extraction minière artisanale", "order_index": 1},
                    {"code": "MIN_02", "name": "Exploration", "order_index": 2},
                    {"code": "MIN_03", "name": "Traitement des minerais", "order_index": 3},
                    {"code": "MIN_04", "name": "Valorisation des minerais", "order_index": 4},
                    {"code": "MIN_05", "name": "Services aux exploitations minières", "order_index": 5},
                    {"code": "MIN_06", "name": "Maintenance des équipements", "order_index": 6},
                    {"code": "MIN_07", "name": "Transport des minerais", "order_index": 7},
                    {"code": "MIN_08", "name": "Autre – à préciser", "order_index": 8},
                ]
            },
            {
                "code": "CON",
                "name": "Consommation",
                "order_index": 24,
                "sub_sectors": [
                    {"code": "CON_01", "name": "Achats groupés alimentaires", "order_index": 1},
                    {"code": "CON_02", "name": "Produits ménagers", "order_index": 2},
                    {"code": "CON_03", "name": "Fournitures scolaires", "order_index": 3},
                    {"code": "CON_04", "name": "Équipements domestiques", "order_index": 4},
                    {"code": "CON_05", "name": "Produits de santé et d’hygiène", "order_index": 5},
                    {"code": "CON_06", "name": "Distribution mutualisée aux adhérents", "order_index": 6},
                    {"code": "CON_07", "name": "Autre – à préciser", "order_index": 7},
                ]
            },
        ]

        dal_sector_id = None
        dal_couscous_sub_id = None
        agri_sector_id = None
        agri_apiculture_sub_id = None
        for s_data in sectors_data:
            existing_s = db.query(Sector).filter(Sector.code == s_data["code"]).first()
            if not existing_s:
                s = Sector(code=s_data["code"], name=s_data["name"], order_index=s_data["order_index"])
                db.add(s)
                db.flush()
                if s.code == "DAL":
                    dal_sector_id = s.id
                elif s.code == "AGR":
                    agri_sector_id = s.id
                for sub_data in s_data.get("sub_sectors", []):
                    sub = SubSector(sector_id=s.id, code=sub_data["code"], name=sub_data["name"], order_index=sub_data["order_index"])
                    db.add(sub)
                    db.flush()
                    if sub.code == "DAL_03":
                        dal_couscous_sub_id = sub.id
                    elif sub.code == "AGR_10":
                        agri_apiculture_sub_id = sub.id
            else:
                if existing_s.code == "DAL":
                    dal_sector_id = existing_s.id
                elif existing_s.code == "AGR":
                    agri_sector_id = existing_s.id
                sub_dal = db.query(SubSector).filter(SubSector.code == "DAL_03").first()
                if sub_dal:
                    dal_couscous_sub_id = sub_dal.id
                sub_api = db.query(SubSector).filter(SubSector.code == "AGR_10").first()
                if sub_api:
                    agri_apiculture_sub_id = sub_api.id

        # 3. Seed Users & Pilot Cooperatives (Real Pilot Data from Brochures & Cahiers des Charges)
        # Admin User
        admin = db.query(User).filter(User.email == "admin@ttsfr.um6p.ma").first()
        if not admin:
            admin = User(
                email="admin@ttsfr.um6p.ma",
                hashed_password=get_password_hash("AdminTTSFR2026!"),
                full_name="Dr. Sabah BELIL",
                role=UserRole.ADMIN,
                phone="0600000000"
            )
            db.add(admin)

        # Pilot Cooperative 1: Coopérative 3ème Millénaire (Marque Lamima - Rehamna)
        coop1_name = "Coopérative 3ème Millénaire (Lamima)"
        coop1_desc = (
            "Fondée en 2006 à Ras El Ain Rehamna (Douar Abbes, Commune Bourouss). "
            "Production artisanale, bio et sans gluten de 32 articles sous la marque Lamima : "
            "couscous (blé, orge, avoine, riz, millet, maïs, quinoa, légumineuses, cactus, jujubier, caroubier), "
            "farines sans gluten, dachich, berkoukch (enrichi au sanouj et habrchad) et graines (quinoa, chia). "
            "Contact : hafidalahi@gmail.com | +212 668 114 397."
        )
        coop1_user = db.query(User).filter(User.email == "pilote1@coop.ma").first()
        if not coop1_user:
            coop1_user = User(
                email="pilote1@coop.ma",
                hashed_password=get_password_hash("CoopPilote1!"),
                full_name="Hafida Lahi (3ème Millénaire)",
                role=UserRole.COOPERATIVE,
                phone="+212 668 114 397"
            )
            db.add(coop1_user)
            db.flush()

            coop1 = Cooperative(
                user_id=coop1_user.id,
                name=coop1_name,
                sector_id=dal_sector_id,
                sub_sector_id=dal_couscous_sub_id,
                region="Marrakech-Safi",
                city="Rehamna (Bourouss - Douar Abbes)",
                member_count=26,
                women_member_count=26,
                activity_description=coop1_desc
            )
            db.add(coop1)
        else:
            coop1_user.full_name = "Hafida Lahi (3ème Millénaire)"
            coop1_user.phone = "+212 668 114 397"
            coop1 = db.query(Cooperative).filter(Cooperative.user_id == coop1_user.id).first()
            if coop1:
                coop1.name = coop1_name
                coop1.sector_id = dal_sector_id
                coop1.sub_sector_id = dal_couscous_sub_id
                coop1.region = "Marrakech-Safi"
                coop1.city = "Rehamna (Bourouss - Douar Abbes)"
                coop1.member_count = 26
                coop1.women_member_count = 26
                coop1.activity_description = coop1_desc

        # Pilot Cooperative 2: Coopérative Féminine Nahla Al Hamra (Marque Honee Bee - Benslimane)
        coop2_name = "Coopérative Nahla Al Hamra (Honee Bee)"
        coop2_desc = (
            "Fondée en 2016 à Douar Bouchouitina, Commune de Benslimane (100% féminine, siège écologique). "
            "Apiculture moderne, écologique et tourisme de santé et cognitif. "
            "Gamme de 20 produits : miels naturels (thym, euphorbe, eucalyptus, caroubier, lavande, oranger, multifleurs, forêt), "
            "gelée royale, pollen, propolis, cocktail d'immunité, vinaigre de miel, cosmétiques (écran solaire naturel 50+, "
            "parfum Queen Bee, baume à lèvres, savon), bougies et paniers en cire d'abeille. "
            "Contact : coopnahlaalhamra@gmail.com | +212 602-013552."
        )
        coop2_user = db.query(User).filter(User.email == "pilote2@coop.ma").first()
        if not coop2_user:
            coop2_user = User(
                email="pilote2@coop.ma",
                hashed_password=get_password_hash("CoopPilote2!"),
                full_name="Référente Nahla Al Hamra",
                role=UserRole.COOPERATIVE,
                phone="+212 602-013552"
            )
            db.add(coop2_user)
            db.flush()

            coop2 = Cooperative(
                user_id=coop2_user.id,
                name=coop2_name,
                sector_id=agri_sector_id,
                sub_sector_id=agri_apiculture_sub_id,
                region="Casablanca-Settat",
                city="Benslimane (Douar Bouchouitina)",
                member_count=20,
                women_member_count=20,
                activity_description=coop2_desc
            )
            db.add(coop2)
        else:
            coop2_user.full_name = "Référente Nahla Al Hamra"
            coop2_user.phone = "+212 602-013552"
            coop2 = db.query(Cooperative).filter(Cooperative.user_id == coop2_user.id).first()
            if coop2:
                coop2.name = coop2_name
                coop2.sector_id = agri_sector_id
                coop2.sub_sector_id = agri_apiculture_sub_id
                coop2.region = "Casablanca-Settat"
                coop2.city = "Benslimane (Douar Bouchouitina)"
                coop2.member_count = 20
                coop2.women_member_count = 20
                coop2.activity_description = coop2_desc

        db.flush()

        # 4. Seed Initial Diagnostics for Both Real Pilot Cooperatives
        if coop1:
            # Exact Excel benchmark values from TTSFR_Diagnostic_MVP_Calcul.xlsx
            coop1_answers = {
                "sector_code": "DAL",
                "sub_sector_code": "DAL_03",
                "p1": "Mécanique dominante",
                "p2": 2,
                "p3": 1,
                "p4": "Gestionnelle",
                "p5": "Techniques & sécurité",
                "o1": 2, "o2": 2, "o3": 1, "o4": 1, "o5": 2,
                "e1": 3, "e2": 1, "e3": 2, "e4": 3, "e5": 1,
                "g1": 0, "g2": 1, "g3": 2, "g4": 2, "g5": 2,
                "t1": 2, "t2": 4, "t3": 2, "t4": 3, "t5": 1,
            }
            eval1 = ScoringEngine.evaluate_diagnostic(coop1_answers)
            coop1_answers["cluster_compatibilities"] = {
                (k.value if hasattr(k, "value") else str(k)): v
                for k, v in eval1["cluster_compatibilities"].items()
            }
            coop1_answers["cluster_code"] = (
                eval1["cluster_code"].value if hasattr(eval1["cluster_code"], "value") else str(eval1["cluster_code"])
            )
            cluster1 = db.query(Cluster).filter(Cluster.code == eval1["cluster_code"]).first()
            diag1 = _reset_pilot_diagnostics(db, coop1.id)
            if not diag1:
                diag1 = DiagnosticSubmission(cooperative_id=coop1.id)
                db.add(diag1)
            diag1.status = DiagnosticStatus.SUBMITTED
            diag1.current_step = 5
            diag1.answers = dict(coop1_answers)
            flag_modified(diag1, "answers")
            diag1.score_operational = eval1["score_operational"]
            diag1.score_economic = eval1["score_economic"]
            diag1.score_organizational = eval1["score_organizational"]
            diag1.score_tech_energy = eval1["score_tech_energy"]
            diag1.score_global = eval1["score_global"]
            diag1.cluster_id = cluster1.id if cluster1 else None
            diag1.rule_version = eval1["rule_version"]

        if coop2:
            coop2_answers = {
                "sector_code": "AGR",
                "sub_sector_code": "AGR_10",
                "p1": "Manuel + mécanique légère",
                "p2": 1,
                "p3": 1,
                "p4": "Simple",
                "p5": "ONSSA / sanitaire",
                "o1": 2, "o2": 2, "o3": 2, "o4": 2, "o5": 1,
                "e1": 2, "e2": 2, "e3": 2, "e4": 3, "e5": 1,
                "g1": 2, "g2": 2, "g3": 2, "g4": 1, "g5": 2,
                "t1": 1, "t2": 1, "t3": 2, "t4": 1, "t5": 2,
            }
            eval2 = ScoringEngine.evaluate_diagnostic(coop2_answers)
            coop2_answers["cluster_compatibilities"] = {
                (k.value if hasattr(k, "value") else str(k)): v
                for k, v in eval2["cluster_compatibilities"].items()
            }
            coop2_answers["cluster_code"] = (
                eval2["cluster_code"].value if hasattr(eval2["cluster_code"], "value") else str(eval2["cluster_code"])
            )
            cluster2 = db.query(Cluster).filter(Cluster.code == eval2["cluster_code"]).first()
            diag2 = _reset_pilot_diagnostics(db, coop2.id)
            if not diag2:
                diag2 = DiagnosticSubmission(cooperative_id=coop2.id)
                db.add(diag2)
            diag2.status = DiagnosticStatus.SUBMITTED
            diag2.current_step = 5
            diag2.answers = dict(coop2_answers)
            flag_modified(diag2, "answers")
            diag2.score_operational = eval2["score_operational"]
            diag2.score_economic = eval2["score_economic"]
            diag2.score_organizational = eval2["score_organizational"]
            diag2.score_tech_energy = eval2["score_tech_energy"]
            diag2.score_global = eval2["score_global"]
            diag2.cluster_id = cluster2.id if cluster2 else None
            diag2.rule_version = eval2["rule_version"]

        # Clean up any temporary test cooperatives created by pytest runs
        test_coops = db.query(Cooperative).filter(Cooperative.name == "Coopérative Nouvelle Bio").all()
        for tc in test_coops:
            tu = db.query(User).filter(User.id == tc.user_id).first()
            db.delete(tc)
            if tu:
                db.delete(tu)

        db.commit()
        print("[SUCCESS] Database successfully seeded with Clusters, ODCO Sectors, and Pilot Accounts.")
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error seeding database: {e}")
        raise e
    finally:
        db.close()

def _reset_pilot_diagnostics(db, cooperative_id):
    """
    Keeps a single diagnostic row per pilot cooperative so the demo accounts always
    open on their submitted results: leftover drafts (e.g. created by clicking
    "Modifier mes réponses" without re-submitting) would otherwise be returned by
    /diagnostics/my-latest, which orders by created_at.
    Returns the oldest remaining row to update in place (or None).
    """
    rows = (
        db.query(DiagnosticSubmission)
        .filter(DiagnosticSubmission.cooperative_id == cooperative_id)
        .order_by(DiagnosticSubmission.created_at.asc())
        .all()
    )
    if not rows:
        return None
    keep = next((r for r in rows if r.status == DiagnosticStatus.SUBMITTED), rows[0])
    for r in rows:
        if r is not keep:
            db.delete(r)
    db.flush()
    return keep


if __name__ == "__main__":
    seed_database()
