import random
import json
from flask import Flask
from Ville.game.database import Database
from flask_cors import CORS


db = Database()
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

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
        return userName, print(userName)

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
    return oldicao, print(userName)



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
    sql = f'''SELECT Saldo
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




#Selling
@app.route('/sell/<product>')
def sell(product):
    global saldo
    risk = random.randint(1, 100)
    if product == 'Roheiini':
        if risk <= 0 * kiinnikerroin: #VAIHDETTU ARVO TESTAUSTA VARTEN
            return [{"answer": "yes"}]
        else:
            saldo += 800 * arvokerroin
            return [{"answer": "no"}],  update(), print(saldo)

    elif product == 'PBK':
        if risk <= 100 * kiinnikerroin: #VAIHDETTU ARVO TESTAUSTA VARTEN
            return [{"answer": "yes"}]
        else:
            saldo += 200 *arvokerroin
            return [{"answer": "no"}], update(), print(saldo)
#updates saldo function
def update():
    sql = f'''UPDATE game 
        SET Saldo = ("{saldo}")
        WHERE screen_name = "{userName}"
        ;'''
    kursori = db.get_conn().cursor()
    kursori.execute(sql)
    return print('funds added')



if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)

