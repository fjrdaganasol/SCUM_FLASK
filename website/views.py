from flask import Blueprint, render_template, request
from flask_login import login_required, current_user
from .models import EventLog
from . import db
from serial import Serial
import time

views = Blueprint('views', __name__)

@views.route('/', methods=['GET', 'POST'])
@login_required
def home():
    return render_template("index.html", user=current_user)


ser = None
ser1 = None
#TESTING CONNECTION TO SERIAL PORTS
try:
    ser = Serial('/dev/ttyACM0', 9600, timeout=10)
except:
    print()
try:
    ser = Serial('/dev/ttyACM1', 9600, timeout=10)
except:
    print()
try:
    ser = Serial('/dev/ttyACM2', 9600, timeout=10)
except:
    print()
try:
    ser = Serial('/dev/ttyACM3', 9600, timeout=10)
except:
    print()

def rnum(strx, subx):
    return subx in strx

uv = ""
air = ""


@views.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    if request.method == 'POST':
        try:
            if request.form.get('interval') == None or request.form.get('interval') == "":
                ser.write(b'set off1234\n')
                return render_template("dashboard.html", user=current_user)
        except Exception as e:
            print(e)

        if request.form.get('stat') == 'Started' and (request.form.get('interval') != None or request.form.get('interval') != ''):
            if request.form.get('uv_s') != 'on':
                uv = 'off'
            else:
                uv = request.form.get('uv_s')
            if request.form.get('air_s') != 'on':
                air = 'off'
            else:
                air = request.form.get('air_s')
        else:
            if request.form.get('uv_s') != 'on':
                uv = 'off'
            else:
                uv = "Terminated"
            if request.form.get('air_s') != 'on':
                air = 'off'
            else:
                air = "Terminated"
        
        room = request.form.get('room_num')
        time = request.form.get('time_now')
        stat = request.form.get('stat')
        date = request.form.get('date_now')
        interval = request.form.get('interval')

        print(room+ " ", time+ " ", stat+ " ", date+ " ", interval+ " ", uv+ " ", air+ " ")
        if ((room == None or room == '') or (time == None or time == '') or (date == None or date == '') or (stat == None or stat == '') or (uv == '' and air == '')):
            return render_template("dashboard.html", user=current_user)
        
        new_rec = EventLog(user_id=current_user.id, uv=uv, air=air, room=room,
                            time=time, interval=interval, stat=stat, date=date)
        db.session.add(new_rec)
        db.session.commit()

        try:
            if (stat == "Stopped"):
                ser.write(b'set off1234\n')
                
            else:
                if rnum(room,"1"):
                    ser.write(b'set on1 ')
                if rnum(room,"2"):
                    ser.write(b'set on2 ')
                if rnum(room,"3"):
                    ser.write(b'set on3 ')
                if rnum(room,"4"):
                    ser.write(b'set on4 ')
                
                if uv == 'on':
                    ser.write(b'uv')
                if air == 'on':
                    ser.write(b'air')
                    
                ser.write(b'\n')
        except Exception as e:
            print(e)

    return render_template("dashboard.html", user=current_user)


@views.route('/eventlog', methods=['GET', 'POST'])
def eventlog():
    logs = EventLog.query.all()
    return render_template("event_log.html", user=current_user, logs=logs)


@views.route('/videostream', methods=['GET', 'POST'])
def videostream():
    
    logs = EventLog.query.all()
    try:
        if request.form.get('interval') == None or request.form.get('interval') == "":
            ser.write(b'set off1234\n')
            return render_template("dashboard.html", user=current_user)
    except Exception as e:
        print(e)
    
    uv1 = ""
    air1 = ""
    if request.method == 'POST':
        if request.form.get('stat') == 'Started' and (request.form.get('interval') != None or request.form.get('interval') != ''):
            if request.form.get('uv_s') != 'on':
                uv1 = 'off'
            else:
                uv1 = request.form.get('uv_s')
            if request.form.get('air_s') != 'on':
                air1 = 'off'
            else:
                air1 = request.form.get('air_s')
        else:
            if request.form.get('uv_s') != 'on':
                uv1= 'off'
            else:
                uv1 = "Terminated"
            if request.form.get('air_s') != 'on':
                air1 = 'off'
            else:
                air1 = "Terminated"
        
        room = request.form.get('room_num')
        time = request.form.get('time_now')
        stat = request.form.get('stat')
        date = request.form.get('date_now')
        interval = request.form.get('interval')

        if ((room == None or room == '') or (time == None or time == '') or (date == None or date == '') or (stat == None or stat == '') or (uv == '' and air == '')):
            return render_template("video_stream.html", user=current_user)

        new_rec = EventLog(user_id=current_user.id, uv=uv1, air=air1, room=room,
                                time=time, interval=interval, stat=stat, date=date)
        db.session.add(new_rec)
        db.session.commit()

        try:
            if (stat == "Stopped"):
                ser.write(b'set off 1234\n')
                
            else:
                if rnum(room,"1"):
                    ser.write(b'set on1 ')
                if rnum(room,"2"):
                    ser.write(b'set on2 ')
                if rnum(room,"3"):
                    ser.write(b'set on3 ')
                if rnum(room,"4"):
                    ser.write(b'set on4 ')
                
                if uv == 'on':
                    ser.write(b'uv')
                if air == 'on':
                    ser.write(b'air')
                    
                ser.write(b'\n')
        except Exception as e:
            print(e)
        
    return render_template("video_stream.html", user=current_user, logs=logs)
