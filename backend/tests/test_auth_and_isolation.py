import pytest
from fastapi.testclient import TestClient

def test_login_invalid_credentials(client: TestClient):
    response = client.post("/api/v1/auth/login", json={
        "email": "inconnu@coop.ma",
        "password": "WrongPassword123!"
    })
    assert response.status_code == 401
    assert response.json()["detail"] == "Identifiants incorrects"

def test_login_and_me_cooperative_pilot_1(client: TestClient):
    # 1. Login Pilot 1
    login_res = client.post("/api/v1/auth/login", json={
        "email": "pilote1@coop.ma",
        "password": "CoopPilote1!"
    })
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    assert token_data["role"] == "COOPERATIVE"
    assert token_data["cooperative_id"] is not None
    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Call /me
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == "pilote1@coop.ma"
    assert me_data["role"] == "COOPERATIVE"
    assert me_data["cooperative"] is not None
    assert me_data["cooperative"]["name"] == "Coopérative 3ème Millénaire (Lamima)"

def test_cooperative_profile_self_update(client: TestClient):
    # Login Pilot 1
    login_res = client.post("/api/v1/auth/login", json={
        "email": "pilote1@coop.ma",
        "password": "CoopPilote1!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch profile
    get_res = client.get("/api/v1/cooperatives/me", headers=headers)
    assert get_res.status_code == 200
    original = get_res.json()
    assert original["name"] == "Coopérative 3ème Millénaire (Lamima)"

    # Update profile
    update_res = client.put("/api/v1/cooperatives/me", headers=headers, json={
        "member_count": 28,
        "women_member_count": 20,
        "activity_description": "Production céréalière et légumineuses bio actualisée."
    })
    assert update_res.status_code == 200
    updated = update_res.json()
    assert updated["member_count"] == 28
    assert updated["women_member_count"] == 20
    assert "actualisée" in updated["activity_description"]

    # Restore original brochure values so tests do not mutate pilot seed data
    client.put("/api/v1/cooperatives/me", headers=headers, json={
        "member_count": original["member_count"],
        "women_member_count": original["women_member_count"],
        "activity_description": original["activity_description"],
    })

def test_strict_multi_tenant_isolation_between_pilots(client: TestClient):
    """
    CRITICAL CONSTRAINT: Cooperative A must NEVER access or modify Cooperative B data.
    """
    # 1. Login Pilot 1
    p1_login = client.post("/api/v1/auth/login", json={
        "email": "pilote1@coop.ma",
        "password": "CoopPilote1!"
    })
    p1_token = p1_login.json()["access_token"]
    p1_headers = {"Authorization": f"Bearer {p1_token}"}

    # 2. Login Pilot 2 to get its cooperative_id
    p2_login = client.post("/api/v1/auth/login", json={
        "email": "pilote2@coop.ma",
        "password": "CoopPilote2!"
    })
    p2_coop_id = p2_login.json()["cooperative_id"]

    # 3. Pilot 1 attempts to view Pilot 2 profile -> 403 Forbidden!
    forbidden_view = client.get(f"/api/v1/cooperatives/{p2_coop_id}", headers=p1_headers)
    assert forbidden_view.status_code == 403
    assert "isolation des données" in forbidden_view.json()["detail"]

    # 4. Pilot 1 attempts to save a diagnostic draft for Pilot 2 -> 403 Forbidden!
    forbidden_draft = client.post(
        f"/api/v1/diagnostics/draft/{p2_coop_id}",
        headers=p1_headers,
        json={"current_step": 2, "answers": {"op_hygiene_safety": 90}}
    )
    assert forbidden_draft.status_code == 403
    assert "isolation des données" in forbidden_draft.json()["detail"]

def test_admin_supervisory_access_across_cooperatives(client: TestClient):
    """
    Admin can supervise both pilot cooperatives.
    """
    # Login Admin
    admin_login = client.post("/api/v1/auth/login", json={
        "email": "admin@ttsfr.um6p.ma",
        "password": "AdminTTSFR2026!"
    })
    assert admin_login.status_code == 200
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Admin lists all cooperatives
    list_res = client.get("/api/v1/cooperatives/", headers=admin_headers)
    assert list_res.status_code == 200
    coops = list_res.json()
    assert len(coops) >= 2
    names = [c["name"] for c in coops]
    assert "Coopérative 3ème Millénaire (Lamima)" in names
    assert "Coopérative Nahla Al Hamra (Honee Bee)" in names

def test_register_new_cooperative(client: TestClient):
    import uuid
    unique_email = f"coop_{uuid.uuid4().hex[:6]}@pilot.ma"
    response = client.post("/api/v1/auth/register", json={
        "email": unique_email,
        "password": "SecurePassword2026!",
        "full_name": "Nouveau Responsable",
        "phone": "0633445566",
        "cooperative_name": "Coopérative Nouvelle Bio",
        "region": "Rabat-Salé-Kénitra",
        "city": "Kénitra"
    })
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "COOPERATIVE"
    assert data["cooperative_id"] is not None

    # Test /me with the new user token
    token = data["access_token"]
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["cooperative"]["name"] == "Coopérative Nouvelle Bio"

