import random
import requests
import json
from flask import Flask
from Ville.game.database import Database
from flask_cors import CORS


db = Database()
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Weather API ------------------------------------------------------
temp = 'empty'

def weatherAPI(location):
    #programm
    global temp
    apikey = 'fb0e15b1ca7ed0a91fcd6d1a7c89b810'
    search = location

    #site https://openweathermap.org/api

    request = f"https://api.openweathermap.org/data/2.5/weather?q={search}&appid={apikey}"
    answer = requests.get(request).json()

    #Temperature
    tocelsius = 273.15
    temperature = answer['main']['temp']
    temp = round((temperature-tocelsius), 1)

    return temp, print(temp)

#-------------------------------------------------------------------

userName = 'empty'

@app.route('/username/<name>')
def username(name):
    global userName
    sql = f'''SELECT screen_name FROM game WHERE screen_name = "{name}"'''
    kursori = db.get_conn().cursor()
    kursori.execute(sql)
    tulos = kursori.fetchone()
    userName = f'{name}'
    #if exists continues with the name
    if str(tulos) != 'None':
        return userName, print(userName)
    #if doesnt exist creates one
    elif str(tulos) == 'None':
        sql = f'''INSERT INTO game(screen_name)
         VALUES("{name}") '''
        kursori = db.get_conn().cursor()
        kursori.execute(sql)
        return userName

#Changes the players start location to finland
@app.route('/reset/<username>')
def reset(username):
    sql = f'''UPDATE game 
    SET location = (SELECT gps_code
    FROM airport
    WHERE name = "Helsinki Vantaa Airport")
    WHERE screen_name = "{username}";'''
    kursori = db.get_conn().cursor()
    kursori.execute(sql)
    return 'ICAO reseted'

#changes the current ICAO to the one you fly to
oldicao = 'EFHK'
location = 'empty'

@app.route('/fly/<icao>')
def flightcode(icao):
    global oldicao
    sql = f'''UPDATE game 
    SET location = (SELECT gps_code
    FROM airport
    WHERE gps_code = "{icao}")
    WHERE screen_name = "{userName}";'''
    kursori = db.get_conn().cursor()
    kursori.execute(sql)
    oldicao = icao
    resetmult()
    getlocation()
    weatherAPI(location)
    weathermult()
    return oldicao

#Fetch all large airports for mark creation
@app.route('/airport/large')
def large():
    sql = f'''SELECT name, latitude_deg, longitude_deg, gps_code
    FROM airport
    WHERE type = "large_airport" '''
    cursor = db.get_conn().cursor(dictionary=True)
    cursor.execute(sql)
    result = cursor.fetchall()
    return json.dumps(result)

#update saldo
@app.route('/balance/<funds>')
def balance(funds):
    sql = f'''UPDATE game 
    SET Saldo = ("{funds}")
    WHERE screen_name = "{userName}"
    ;'''
    kursori = db.get_conn().cursor()
    kursori.execute(sql)
    return 'saldo added'

#giving balance results in the end
@app.route('/results')
def results():
    sql = f'''SELECT Saldo, screen_name
    FROM game
    WHERE screen_name = "{userName}" '''
    cursor = db.get_conn().cursor(dictionary=True)
    cursor.execute(sql)
    result = cursor.fetchall()
    return json.dumps(result)

#kertoimet
kiinnikerroin = 1
arvokerroin = 1
saldo = 0


#shop route
@app.route('/shop/<product>')
def shop(product):
    global kiinnikerroin
    global arvokerroin
    global saldo
    if product == 'joggers':
        if saldo >= 200:
            saldo -= 200
            kiinnikerroin -= 0.1
            return [{"answer": "yes"}], update(), print(saldo)
        elif saldo < 200:
            return [{"answer": "no"}]

    elif product == 'packing':
        if saldo >= 500:
            saldo -= 500
            kiinnikerroin -= 0.2
            return [{"answer": "yes"}], update(), print(saldo)
        elif saldo < 500:
            return [{"answer": "no"}]

    elif product == 'suitcase':
        if saldo >= 800:
            saldo -= 800
            kiinnikerroin -= 0.4
            return [{"answer": "yes"}], update(), print(saldo)
        elif saldo < 800:
            return [{"answer": "no"}]

    elif product == 'quality':
        if saldo >= 400:
            saldo -= 400
            arvokerroin += 0.2
            return [{"answer": "yes"}], update(), print(saldo)
        elif saldo < 400:
            return [{"answer": "no"}]

    elif product == 'qualityc':
        if saldo >= 600:
            saldo -= 600
            arvokerroin += 0.2
            return [{"answer": "yes"}], update(), print(saldo)
        elif saldo < 600:
            return [{"answer": "no"}]
#updates saldo
def update():
    sql = f'''UPDATE game 
        SET Saldo = ("{saldo}")
        WHERE screen_name = "{userName}"
        ;'''
    kursori = db.get_conn().cursor()
    kursori.execute(sql)
    return print('funds removed')

#adding multiplier from weather
multi = 1
resetmulti = 1

def resetmult():
    global multi
    global resetmulti
    multi = multi/resetmulti
    return multi

def weathermult():
    global multi
    global resetmulti
    if int(temp) > 0:
        multi = multi*1.2
        resetmulti = 1.2
    elif int(temp) == 0:
        multi = multi*1
        resetmulti = 1
    else:
        multi = multi*0.8
        resetmulti = 0.8
    return multi, resetmulti

def getlocation():
    global location
    sql = f'''SELECT municipality 
        FROM airport 
        WHERE gps_code = "{oldicao}"
        ;'''
    cursor = db.get_conn().cursor()
    cursor.execute(sql)
    city = cursor.fetchone()
    location = city[0]
    return location




#Selling
@app.route('/sell/<product>')
def sell(product):
    global saldo
    risk = random.randint(1, 100)
    if product == 'Roheiini':
        if risk <= 0 * kiinnikerroin: #VAIHDETTU ARVO TESTAUSTA VARTEN
            return [{"answer": "yes"}]
        else:
            earnings1 = 800 * arvokerroin * multi
            saldo += 800 * arvokerroin * multi
            return [{"answer": "no"}, {'saldo': earnings1}],  update(), print(saldo)

    elif product == 'PBK':
        if risk <= 100 * kiinnikerroin: #VAIHDETTU ARVO TESTAUSTA VARTEN

            return [{"answer": "yes"}]
        else:
            earnings2 = 200 * arvokerroin * multi
            saldo += 200 * arvokerroin * multi
            return [{"answer": "no"}, {'earnings': earnings2}], update(), print(saldo)


#updates saldo function
def update():
    sql = f'''UPDATE game 
        SET Saldo = ("{saldo}")
        WHERE screen_name = "{userName}"
        ;'''
    kursori = db.get_conn().cursor()
    kursori.execute(sql)
    return print('funds added')

#reset player
@app.route('/resetall')
def resetall():
    global kiinnikerroin
    global arvokerroin
    global saldo
    global userName
    kiinnikerroin = 1
    arvokerroin = 1
    saldo = 0
    userName = 'empty'
    return print('reseted', saldo)


@app.route("/leaderboard")
def leaderboard():
    sql = f"SELECT screen_name, Saldo FROM game WHERE Saldo IS NOT NULL"
    kursori = db.get_conn().cursor()
    kursori.execute(sql)
    lbtuple = kursori.fetchall()

    lblist = []

    for i in lbtuple:
        lblist.append(list(i))

    for i in lblist:
        i[1] = round(float(i[1]), 2)

    lblist.sort(reverse=True, key=lambda a: a[1])
    print(lblist)
    return lblist


if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)

