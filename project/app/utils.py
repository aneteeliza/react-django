# myapp/utils.py

def map_kritusie_data(data):
    return {
        "name": data["vards_uzvards"],
        "rank": data["dienesta_pakape"],
        "unit": data["vieniba"],
        "notes": data["piezimes"],
    }


def map_brigade_data(data):
    return {
        "name": data["uzvards_un_vards"],
        "rank": data["pakape"],
        "unit": data["dienesta_vieniba"],
        "notes": data["piezimes"],
    }


def map_mobilizetie_data(data):
    return {
        "name": f"{data['vards']} {data['uzvards']}",
        "rank": None,
        "unit": None,
        "notes": None,
    }


def map_zedelgema_data(data):
    return {
        "name": f"{data['vards']} {data['uzvards']}",
        "rank": data["dienesta_pakape"],
        "unit": data["dienesta_vieniba"],
        "notes": data["piezimes"],
    }
