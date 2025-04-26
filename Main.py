import requests

url = "http://192.168.0.44:9090/post_monitor_download"
data = {
    "start_date": "2025-04-15",
    "end_date": "2025-04-17"
}

response = requests.post(url, json=data)
if response.status_code == 200:
    filename = response.headers.get('Content-Disposition', 'filename=monitoring.xlsx').split('filename=')[1].strip('"')
    with open(filename, "wb") as f:
        f.write(response.content)
    print(f"Fayl yuklandi: {filename}")
else:
    print(f"Xato: {response.status_code}, {response.text}")