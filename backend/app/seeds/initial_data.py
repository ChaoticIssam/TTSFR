from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models import (
    User, Cooperative, UserRole,
    Sector, SubSector,
    Cluster, Module, ClusterCode, ModuleCategory
)

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
                "icon": "HandMetal",
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
                "code": "AGRI",
                "name": "Agriculture",
                "order_index": 1,
                "sub_sectors": [
                    {"code": "AGRI_PROD", "name": "Production primaire (Céréales, maraîchage, arboriculture...)", "order_index": 1},
                    {"code": "AGRI_ELEV", "name": "Élevage (Ovins, caprins, bovins, volailles...)", "order_index": 2},
                    {"code": "AGRI_APIC", "name": "Apiculture (Production de miel et dérivés)", "order_index": 3},
                    {"code": "AGRI_SERV", "name": "Services agricoles (Irrigation, mécanisation, prestations...)", "order_index": 4},
                    {"code": "AGRI_TRANS", "name": "Transformation agroalimentaire (Conditionnement, valorisation...)", "order_index": 5},
                    {"code": "AGRI_BIO", "name": "Filière biologique (Circuits courts, bio certifié...)", "order_index": 6},
                    {"code": "AGRI_EXP", "name": "Exportation agricole", "order_index": 7},
                ]
            },
            {
                "code": "ARTISANAT",
                "name": "Artisanat",
                "order_index": 2,
                "sub_sectors": [
                    {"code": "ART_TEXTILE", "name": "Tissage, tapis et textile traditionnel", "order_index": 1},
                    {"code": "ART_POTERIE", "name": "Poterie, céramique et zellige", "order_index": 2},
                    {"code": "ART_BOIS", "name": "Menuiserie et sculpture sur bois", "order_index": 3},
                    {"code": "ART_CUIR", "name": "Maroquinerie et travail du cuir", "order_index": 4},
                ]
            },
            {"code": "DENREES", "name": "Denrées alimentaires", "order_index": 3, "sub_sectors": []},
            {"code": "ARGAN", "name": "Argan", "order_index": 4, "sub_sectors": []},
            {"code": "PAM", "name": "Plantes aromatiques et médicinales", "order_index": 5, "sub_sectors": []},
            {"code": "PECHE", "name": "Pêche maritime", "order_index": 6, "sub_sectors": []},
            {"code": "FORET", "name": "Forêt", "order_index": 7, "sub_sectors": []},
            {"code": "TOURISME", "name": "Tourisme", "order_index": 8, "sub_sectors": []},
            {"code": "PRESTATION", "name": "Prestation de services", "order_index": 9, "sub_sectors": []},
            {"code": "CONSEIL", "name": "Conseil et gestion", "order_index": 10, "sub_sectors": []},
            {"code": "ECOMMERCE", "name": "Commerce électronique", "order_index": 11, "sub_sectors": []},
            {"code": "TRANSPORT", "name": "Transport", "order_index": 12, "sub_sectors": []},
        ]

        agri_sub_sector_id = None
        for s_data in sectors_data:
            existing_s = db.query(Sector).filter(Sector.code == s_data["code"]).first()
            if not existing_s:
                s = Sector(code=s_data["code"], name=s_data["name"], order_index=s_data["order_index"])
                db.add(s)
                db.flush()
                for sub_data in s_data.get("sub_sectors", []):
                    sub = SubSector(sector_id=s.id, code=sub_data["code"], name=sub_data["name"], order_index=sub_data["order_index"])
                    db.add(sub)
                    db.flush()
                    if s.code == "AGRI" and sub.code == "AGRI_PROD":
                        agri_sub_sector_id = sub.id
            else:
                if s_data["code"] == "AGRI":
                    sub = db.query(SubSector).filter(SubSector.code == "AGRI_PROD").first()
                    if sub:
                        agri_sub_sector_id = sub.id

        # 3. Seed Users & Pilot Cooperatives
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

        # Pilot Cooperative 1 User & Profile
        coop1_user = db.query(User).filter(User.email == "pilote1@coop.ma").first()
        if not coop1_user:
            coop1_user = User(
                email="pilote1@coop.ma",
                hashed_password=get_password_hash("CoopPilote1!"),
                full_name="Référent Coopérative Pilote 1",
                role=UserRole.COOPERATIVE,
                phone="0611223344"
            )
            db.add(coop1_user)
            db.flush()

            coop1 = Cooperative(
                user_id=coop1_user.id,
                name="Coopérative Agricole Pilote 1",
                sub_sector_id=agri_sub_sector_id,
                region="Marrakech-Safi",
                city="Benguerir",
                member_count=24,
                women_member_count=18,
                activity_description="Production et conditionnement de céréales et légumineuses locales."
            )
            db.add(coop1)

        # Pilot Cooperative 2 User & Profile
        coop2_user = db.query(User).filter(User.email == "pilote2@coop.ma").first()
        if not coop2_user:
            coop2_user = User(
                email="pilote2@coop.ma",
                hashed_password=get_password_hash("CoopPilote2!"),
                full_name="Référent Coopérative Pilote 2",
                role=UserRole.COOPERATIVE,
                phone="0622334455"
            )
            db.add(coop2_user)
            db.flush()

            coop2 = Cooperative(
                user_id=coop2_user.id,
                name="Coopérative Artisanale & Huile Pilote 2",
                sub_sector_id=agri_sub_sector_id,
                region="Souss-Massa",
                city="Taroudant",
                member_count=35,
                women_member_count=30,
                activity_description="Extraction traditionnelle et conditionnement d'huile d'argan certifiée."
            )
            db.add(coop2)

        db.commit()
        print("✅ Database successfully seeded with Clusters, ODCO Sectors, and Pilot Accounts!")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
