var db = null;
var userEmail = "";
var userPassword = "";
var storage = window.localStorage;
// add event listeners
document.addEventListener("deviceReady", connectToDatabase);
document.addEventListener("deviceReady", saveButtonPressed);
//document.getElementById("insert-hero").addEventListener("click", saveButtonPressed);
document.getElementById("show-heros").addEventListener("click", showAllPressed);
document.getElementById("rescue-me").addEventListener("click", vibration);
document.getElementById("login-button").addEventListener("click", userLogin);

function vibration() {
    navigator.vibrate(3000);
}

function userLogin()
{
   userEmail = document.getElementById("email").value;
    userPassword = document.getElementById("password").value;
    alert(userEmail+userPassword);
}

function connectToDatabase() {
    console.log("device is ready - connecting to database");
    if (window.cordova.platformId === 'browser') {
        db = window.openDatabase("dating", "1.0", "Database for dating app", 2 * 1024 * 1024);
    } else {
        var databaseDetails = {"name": "dating.db", "location": "default"}
        db = window.sqlitePlugin.openDatabase(databaseDetails);
        console.log("done opening db");
    }

    if (!db) {
        alert("databse connection failed!");
        return false;
    }

    // 3. create relevant tables
    db.transaction(createTables)

}

function createTables(transaction) {
    var sql = "CREATE TABLE IF NOT EXISTS users (id integer PRIMARY KEY AUTOINCREMENT,name text, email text, password text, age text,\n\
 gender text, location text, phone text)";
    transaction.executeSql(sql, [], createSuccess, createFail)
}

function createSuccess(tx, result) {

}
function createFail(error) {
    alert("Failure while creating table: " + error);
}


function saveButtonPressed(transaction) {
    console.log("save!!!");

    db.transaction(function (transaction) {
        // save the values to the database
        var sql = "INSERT INTO users (name, email,password, age,gender,location,phone) \n\
VALUES ('Spiderman','user@example.com','password','20', 'Male','Toronto','1234567890'),('Thor','user@example.com','password', '20', 'Male','Toronto','1234567890'),('Superman','user@example.com','password','20', 'Male','Toronto','1234567890')";

        transaction.executeSql(sql, [], function (tx, result) {
            alert("Insert success");
            //showAllPressed()
        }, function (error) {
            alert("Insert failed: " + error);
        });
    }

    );




}

function showAllPressed() {
    // clear the user interface
    document.getElementById("dbItems").innerHTML = "";

    db.transaction(function (transaction) {
        transaction.executeSql("SELECT * FROM users", [],
                function (tx, results) {
                    var numRows = results.rows.length;

                    for (var i = 0; i < numRows; i++) {

                        // to get individual items:
                        var item = results.rows.item(i);
                        console.log(item);
                        console.log(item.name);


                        // show it in the user interface
                        document.getElementById("dbItems").innerHTML +=
                                "<p>Name: " + item.name + "</p>"
                                + "<p>Email : " + item.email + "</p>"
                                + "<p>=======================</p>";
                    }

                }, function (error) {
        });
    });
}