from flask import Flask
import requests

app = Flask(__name__)

@app.route('/api/raiderio/<region>/<realm>/<name>', methods=['GET'])
def get_raiderio(region, realm, name):
    url = "https://raider.io/api/v1/characters/profile?region={region}&realm={realm}&name={name}&fields=gear%2C%20talents%2C%20guild%2C%20raid_progression%2C%20mythic_plus_ranks%2C%20raid_achievement_curve%2C%20mythic_plus_best_runs".format(
        region = region,
        realm = realm,
        name = name
    )

    response = requests.get(url)
    data = {}
    
    if response.status_code == 200:
        data = response.json()
    else:
        print("Error retrieving information. Status code {0}".format(response.status_code))

    return data

@app.route('/api/warcraftlogs', methods=['GET'])
def get_warcraftlogs():
    url = ""

    response = requests.get(url)

@app.route('/api/blizzard', methods=['GET'])
def get_blizzard():
    url = ""

    response = requests.get(url)
    
if __name__ == '__main__':
    app.run(debug=True)
