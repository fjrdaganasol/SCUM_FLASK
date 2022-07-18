//SUBMIT BUTTON ACTION

// VARIABLE DECLARATION
var h1 = document.getElementById('h1');
var m1 = document.getElementById('m1');
var s1 = document.getElementById('s1');

var start_btn = document.getElementById('start');


const COUNTER_KEY1 = 'my-counter1';
const COUNTER_KEY2 = 'my-counter2';
const COUNTER_KEYP = 'primary-key';

var countDownTime = 0;

var start_op = 0;


//FUNCTION CALL FOR SUBMIT BUTTON
function start_action(e){  

    //CHECK ROOM CHECKBOX
    start_op += CheckBoxChecker();

    //CHECK TIMER VALIDITY
    start_op += TimerChecker();

    //CHECK CHECKBOX OPERATION
    start_op += opSwitch();    

    //ACTION AFTER NO ERROR
    if (start_op < 1){

        //OPERATION CHECKER
        if (start_btn.innerHTML == "Stop"){
            //SETTING PARAMETERS FOR DATABASE
            enable_setting(start_btn.innerHTML);
            roomCounter();
            dateTime();

            //CLEARING VARIABLES' SESSIONS
            ClearSession();
            
            start_btn.value = "Stopped";
            start_btn.innerHTML = "Start";

            h1.value = "00";
            m1.value = "00";
            s1.value = "00";

        }else {
            //SETTING PARAMETERS FOR DATABASE
            enable_setting(start_btn.innerHTML);
            roomCounter();
            dateTime();
            tInterval();

            //STARTING VARIABLES' SESSIONS
            StartSession();
            
            document.getElementById('stat').value = "Started";
            start_btn.innerHTML = "Stop";
            }
    }else{
        e.preventDefault();
        
    }

    start_op = 0;
    //(window.sessionStorage.getItem('my-counter2'));
}






    //START VARIABLES SESSIONS
    function StartSession(){
        countDownTime = parseInt((parseInt(h1.value) * 60 * 60) + (parseInt(m1.value) * 60) + parseInt(s1.value));

        window.sessionStorage.setItem(COUNTER_KEYP,countDownTime);
        window.sessionStorage.setItem(COUNTER_KEY1,countDownTime);
        window.sessionStorage.setItem(COUNTER_KEY2, 1);
    }


    //CLEAR VARIABLES SESSIONS
    function ClearSession(){

        int_span = window.sessionStorage.getItem(COUNTER_KEY1) - window.sessionStorage.getItem(COUNTER_KEYP);

        window.sessionStorage.setItem(COUNTER_KEY2, 2);
        window.sessionStorage.setItem(COUNTER_KEYP,0);
        window.sessionStorage.setItem(COUNTER_KEY1,0);
            
        let temph = parseInt(int_span / (60 * 60));
        let tempm = parseInt(int_span / 60);
        let temps = parseInt(int_span % 60);

        if (temph < 10) {temph = "0" + temph;}
        if (tempm < 10) {tempm = "0" + tempm;}
        if (temps < 10) {temps = "0" + temps;}
            
        document.getElementById('interval').value = temph + " : " + tempm + " : " + temps;
        document.getElementById('stat').value = "Stopped";
    }


    //CHECKBOX FILTER
    function CheckBoxChecker(){
        var r1 = document.getElementById('r1');
        var r2 = document.getElementById('r2');
        var r3 = document.getElementById('r3');
        var r4 = document.getElementById('r4');

        var flagger = 0;

        if (r1.checked == true){
            flagger += 1;
        }else if (r2.checked == true){
            flagger += 2;
        }else if (r3.checked == true){
            flagger += 3;
        }else if (r4.checked == true){
            flagger += 4;
        }
        if (flagger == 0){
            document.getElementById('inlineb').innerHTML = "Please select room or floor number";
            document.getElementById('showa').style.display = "block";
            return 1;
        }
        return 0;
    }

    //
    function TimerChecker(){

        let inh = parseInt(h1.value);
        let inm = parseInt(m1.value);
        let ins = parseInt(s1.value);

        if ((inh <= 0 & inm <= 0 & ins <= 0) | (inh <= 0 & inm < 0) | (isNaN(inh) | isNaN(inm) | isNaN(ins))) {
            //CHECK IF STOP ACTION IS PERFORMED
            if(start_btn.innerHTML == "Stop"){
                return 0;

                //CHECK IF INPUTED VALUES ARE INVALID
            }else{
                document.getElementById('inlineb').innerHTML = "Invalid time interval. Time interval must be greater than or eaqual to 2 minutes";
                document.getElementById('showa').style.display = "block";
                document.getElementById('m1').value = "00";
                window.sessionStorage.setItem(COUNTER_KEYP, 0);
                window.sessionStorage.setItem(COUNTER_KEY2, 0);
                window.sessionStorage.setItem(COUNTER_KEY1, 0);
                h1.readOnly = false;
                m1.readOnly = false;
                s1.readOnly = false;
                return 1;
            }
        }
        return 0;
    }

    //OPERATION FILTER
    function opSwitch(){
        var uvs = document.getElementById('uv_s');
        var airs = document.getElementById('air_s');
    
        /*OPERATION EXCEPTION +++ ++*/
        if (uvs.checked == false ) {
            if (airs.checked == false){

                //RESET VARIABLES' SESSION
                document.getElementById('showa').style.display = "block";
                document.getElementById('inlineb').innerHTML = "Please select an operation";
                document.getElementById('m1').value = "00";
    
                window.sessionStorage.setItem(COUNTER_KEY2, 0);
                window.sessionStorage.setItem(COUNTER_KEYP, 0);
                window.sessionStorage.setItem(COUNTER_KEY1, 0);


                h1.readOnly = false;
                m1.readOnly = false;
                s1.readOnly = false;
                return 1;
            }
        }
        return 0;
    }


    //DATE AND TIME GENERATOR
    function dateTime (){
        // Get today's date and time
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let day = now.getDate();

        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        let day_time = "AM";

        if (month < 10) {month = "0"+ month;}
        if (day < 10) {day = "0"+ day;}
        if (minutes < 10) {minutes = "0"+ minutes;}
        if (seconds < 10) {seconds = "0"+ seconds;}

        document.getElementById('date_now').value = year + "-" + month + "-" + day;
        if (hours > 12){
            hours = hours - 12;
            day_time = "PM";
        }
        document.getElementById('time_now').value = hours + ":" + minutes + ":" + seconds + " " + day_time;
    }


    //ROOM NUMBER GENERATOR
    function roomCounter() {
        const rclass = document.getElementsByClassName("rclass");
        var rn = document.getElementById('room_num');

        for (let i = 0; i < 4; i++){
            if (rclass[i].checked == true){
                rn.value += (i + 1) + ", ";
            }
        }

        rn.value = rn.value.substr(0, rn.value.length - 2);
    }


    //TIME INTERVAL GENERATOR
    function tInterval(){
        if (h1.value.length < 2) {
            h1.value = "0" + h1.value;
        }
        if (m1.value.length < 2) {
            m1.value = "0" + m1.value;
        } 
        if (s1.value.length < 2) {
            s1.value = "0" + s1.value;
        }
    
        document.getElementById('interval').value = h1.value + " : " + m1.value + " : " + s1.value;
    }


    //TIMER KEYPRESS FILTER
    function hms_valuefil(input1){
        var hrs = document.getElementById('h1');
        var mns = document.getElementById('m1');
        var scs = document.getElementById('s1');

        if (parseInt(input1.value) > 59 | parseInt(h1.value) >= 10){
            if (scs == input1){
                if (parseInt(hrs.value) >= 10){
                    hrs.value = "10";
                    mns.value = "00";
                    input1.value = "00";
                }
                if (parseInt(input1.value) > 59){
                    mns.value = parseInt(mns.value) + 1;
                    input1.value = "00"; 
                    if (parseInt(mns.value) > 59){
                        mns.value = "00";
                        hrs.value = parseInt(hrs.value) + 1;
                    }
                }
            }else if (mns == input1){
                if (parseInt(input1.value) > 59){
                    hrs.value = parseInt(hrs.value) + 1;
                    input1.value = "00";
                }
                if (parseInt(h1.value) >= 10){
                    hrs.value = "10";
                    scs.value = "00";
                    input1.value = "00";
                }
            }else if (hrs == input1){ 
                if (parseInt(input1.value) >= 10){
                    input1.value = "10";
                    mns.value = "00";
                    scs.value = "00";
                }
            }
        }
        else if (input1.value.length > 2){
            input1.value = input1.value.slice(1);
            
        }
    }

    //HOUR VALUE FILTER
    function hms_valuefil1(input1){
        if (parseInt(input1.value) >= 10){
            input1.value = "10";
            input1.value == input.max;
            document.getElementById('m').value = "00";
            document.getElementById('s').value = "00";
        }
    }
