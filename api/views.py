# Create your views here.
from django.views import View
import json
from django.http import HttpResponse, JsonResponse
from .models import MyForm
import requests


class CreateData(View):
    def get(self, request):
        data_set = list(MyForm.objects.all().values())[::-1]
        return JsonResponse({"data": data_set})

    def post(self, request):
        jd = json.loads(request.body)
        MyForm.objects.create(**jd)
        return HttpResponse("oki", status=200)


# Headers for the request
headers = {
    "app_id": "8c377891",
    "app_key": "b7f07f11b521d7b74fbe759f0e9ecf2d",
    "Content-Type": "application/json",  # Specify the Content-Type as JSON
}


def get_bigger_race(datos):
    etnias = {
        "asian": "asiática",
        "black": "negra",
        "hispanic": "hispana",
        "other": "otro",
        "white": "blanca",
    }

    mayor_etnia = ""
    mayor_valor = 0

    for etnia, valor in datos.items():
        if etnia in etnias and valor > mayor_valor:
            mayor_etnia = etnias[etnia]
            mayor_valor = valor

    return mayor_etnia


class DetectFace(View):
    def post(self, request):
        jd = json.loads(request.body)
        image = jd["image"]
        payload = {
            "image": image,
            "subject_id": "master",
            "gallery_name": "master",
        }
        response = requests.post(
            "https://api.kairos.com/enroll", json=payload, headers=headers
        )
        print(image)
        print(response)
        try:
            data = response.json()["images"][0]
            data = data.get("attributes")
            race = get_bigger_race(data)
            person_data = {
                "age": data["age"],
                "race": race,
                "gender": data["gender"]["type"],
            }
            print(person_data)
            return JsonResponse({"person_data": person_data})
        except Exception as e:
            print(e)
            return HttpResponse("error", status=500)


# from django.contrib.auth import authenticate
