// import express from "express";
// import bodyParser from "body-parser";
// import mysql from "mysql2";
// import bcrypt from "bcrypt";
// import session from "express-session"
// import passport from "passport";
// import Strategy from "passport-local";






// const App = express();
// const PORT = process.env.PORT || 3000;
// const saltRounds = await bcrypt.genSalt(10);






// App.use(session({
// 	secret: "HS",
// 	resave: false,
// 	saveUninitialized: true,
// 	cookie: {
// 		maxAge: 1000 * 60 * 5, //5 minute validity
// 	}
// })
// );




// //Passport should always be declrared after expression
// App.use(passport.initialize());
// App.use(passport.session());




// App.use(bodyParser.urlencoded({
// 	extended: false
// }));
// //create a connection first



// let con = mysql.createConnection({
// 	host: "localhost",
// 	user: "root",
// 	password: "1234",
// 	database: "mydatabase"
// });


// con.connect((err) => {
// 	if (err) {
// 		console.log("Error connecting to MYSQL: " + err.stack);
// 		return;
// 	}
// 	console.log(`Connection Established!`);
// });







// App.get("/secrets", async (req, res) => {
//   if (req.isAuthenticated()) {
//     const userEmail = req.session.passport.user.email;

// 		try{
// 			let result = await con.query("SELECT * FROM notes WHERE email = ?", [userEmail]);
// 			console.log(result);
// 			return res.render("secret.ejs", {data: result});
// 		}catch(err){
// 			return res.render("secret.ejs");
// 		}
//   } else {
//     console.log("Pehle expression setup karo (Please set up authentication first)");
//     res.redirect("/oldUser");
//   }
// });








// App.post("/addnote", async(req, res)=>{

// 	if(req.isAuthenticated()){
// 		const userNote = req.body.note;
// 		const userEmail = req.session.passport.user.email;
// 		console.log(userEmail);
// 		console.log(userNote);
// 		const sql = `INSERT INTO notes (email, note) VALUES ('${userEmail}', '${userNote}')`;
// 		con.query(sql, (err, result)=>{
// 			if(err){
// 				console.log(`Unable to insert the note into database`);
// 				return res.redirect("/secrets");
// 			} else{
// 				return res.redirect("/secrets");
// 			}
// 		});
// 	}
// });








// App.post("/signin", passport.authenticate('local', {failureRedirect: '/oldUser'}), (req, res) => {
// 	res.redirect('/secrets');
// });









// App.post("/signup", async (req, res) => {
// 	let userEmail = req.body.email.toLowerCase().trim();
// 	let userMobile = req.body.mobileNumber;
// 	let userPassword = req.body.password;
// 	userPassword = await bcrypt.hash(userPassword, saltRounds);

// 	let allow = await checkDuplicateUser(userEmail, userMobile);

// 	if (!allow) {
// 		return res.status(500).send("User already Present in our record.");
// 	}
// 		const sql = `INSERT INTO users (email, mobile, password) VALUES ('${userEmail}', '${userMobile}', '${userPassword}')`; //seen from stackoverflow, prefer this always
// 		con.query(sql, (err, result) => {
// 			if (err) {
// 				return res.status(500).send("Seems that your email or mobile number is already registered with us, Please signin or use other credentials!");
// 			}
// 			res.redirect("/oldUser");
// 		});

// });











// App.get("/secrets", (req, res)=>{
// 	// if(req.isAuthenticated()){
// 	// 	res.render("secret.ejs");
// 	// }else{
// 	// 	res.redirect("/oldUser");
// 	// }
// 	req.render("secret.ejs");
// })









// App.get("/newUser", (req, res) => {
// 	res.render("signup.ejs");
// })








// App.get("/oldUser", (req, res) => {
// 	res.render("signin.ejs");
// })








// passport.use(new Strategy(async function verify(username, password, cb){

// 	const inputEmail = username.toLowerCase().trim();
// 	const inputPass = password;
// 	console.log("Input Email: " + inputEmail);
// 	console.log("Input Passoword: " + inputPass);

// 	//search for password from the databse
// 	try{
// 		con.query("SELECT * FROM users WHERE email = ?", [inputEmail], async(error, result)=>{
// 			if(error){
// 				console.log("Error while searching in the records");
// 				return cb(error);
// 			}
// 			if(result.length === 0){
// 				return cb(null, false);
// 			}
// 			const savedPass = result[0].password;
// 			console.log("Saved Pass: " + savedPass);
// 			console.log(result);
// 			try{
// 				const isMatch = await bcrypt.compare(inputPass, savedPass);
// 				console.log("Match" + isMatch);
	
// 				if(isMatch === true){
// 					return cb(null, result); //doubtful
// 				} else{
// 					console.log("Not matched");
// 					return res.redirect("oldUser");
// 				}
// 			} catch(err){
// 				console.log("Password compairing error" + err);
// 				return cb(err);
// 			}
// 		});
// 	} catch(err){
// 		return cb(err);
// 	}

// }));








// passport.serializeUser((user, cb)=>{
// 	cb(null, user);
// });





// passport.deserializeUser((user, cb)=>{
// 	cb(null, user);
// });







// App.listen(PORT, async() => {
// 	console.log(`App is running on PORT ${PORT}`);
// });







// async function checkDuplicateUser(email, number) {
//   let result1, result2;

//   try {
//     result1 = await con.query("SELECT 1 FROM users WHERE email = ?", [email]);
//     result2 = await con.query("SELECT 1 FROM users WHERE mobile = ?", [number]);

// 		console.log(result1);
// 		console.log(result2);

//     // Check if either query returned any results
//     return !(result1.length > 0 || result2.length > 0);
		
//   } catch (err) {
//     console.log("Error checking for duplicate user:", err.stack);
//     return true; // or throw the error, depending on your requirements
//   }
// }


import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2/promise"; // Import promise-based version
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import Strategy from "passport-local";

const App = express();
const PORT = process.env.PORT || 3000;
const saltRounds = await bcrypt.genSalt(10);

App.use(session({
	secret: "HS",
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 1000 * 60 * 5, // 5 minutes validity
	}
}));

App.use(passport.initialize());
App.use(passport.session());

App.use(bodyParser.urlencoded({ extended: false }));

// Create a promise-based connection
const con = await mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "1234",
	database: "mydatabase"
});

console.log(`Connection Established!`);

App.get("/secrets", async (req, res) => {
	if (req.isAuthenticated()) {
		const userEmail = req.session.passport.user.email;
		try {
			const [rows] = await con.query("SELECT * FROM notes WHERE email = ?", [userEmail]);
			return res.render("secret.ejs", { data: rows });
		} catch (err) {
			console.error(err);
			return res.render("secret.ejs");
		}
	} else {
		console.log("Please set up authentication first");
		res.redirect("/oldUser");
	}
});

App.post("/addnote", async (req, res) => {
	if (req.isAuthenticated()) {
		const userNote = req.body.note;
		const userEmail = req.session.passport.user.email;
		console.log(userEmail, userNote);
		const sql = `INSERT INTO notes (email, note) VALUES (?, ?)`;
		try {
			await con.query(sql, [userEmail, userNote]);
			return res.redirect("/secrets");
		} catch (err) {
			console.error("Unable to insert the note into the database", err);
			return res.redirect("/secrets");
		}
	}
});

App.post("/signin", passport.authenticate('local', { failureRedirect: '/oldUser' }), (req, res) => {
	res.redirect('/secrets');
});

App.post("/signup", async (req, res) => {
	let userEmail = req.body.email.toLowerCase().trim();
	let userMobile = req.body.mobileNumber;
	let userPassword = await bcrypt.hash(req.body.password, saltRounds);

	let allow = await checkDuplicateUser(userEmail, userMobile);

	if (!allow) {
		return res.status(500).send("User already Present in our record.");
	}
	const sql = `INSERT INTO users (email, mobile, password) VALUES (?, ?, ?)`;
	try {
		await con.query(sql, [userEmail, userMobile, userPassword]);
		res.redirect("/oldUser");
	} catch (err) {
		return res.status(500).send("Seems that your email or mobile number is already registered with us, Please signin or use other credentials!");
	}
});

App.get("/newUser", (req, res) => {
	res.render("signup.ejs");
});

App.get("/oldUser", (req, res) => {
	res.render("signin.ejs");
});

passport.use(new Strategy(async (username, password, cb) => {
	const inputEmail = username.toLowerCase().trim();
	console.log("Input Email: " + inputEmail);

	try {
		const [result] = await con.query("SELECT * FROM users WHERE email = ?", [inputEmail]);
		if (result.length === 0) {
			return cb(null, false);
		}
		const savedPass = result[0].password;
		const isMatch = await bcrypt.compare(password, savedPass);
		if (isMatch) {
			return cb(null, result[0]); // Pass the user object, not the whole result
		} else {
			console.log("Not matched");
			return cb(null, false);
		}
	} catch (err) {
		console.error("Error while searching in the records", err);
		return cb(err);
	}
}));

passport.serializeUser((user, cb) => {
	cb(null, user);
});

passport.deserializeUser((user, cb) => {
	cb(null, user);
});

App.listen(PORT, () => {
	console.log(`App is running on PORT ${PORT}`);
});

async function checkDuplicateUser(email, number) {
	let result1, result2;
	try {
		const [res1] = await con.query("SELECT 1 FROM users WHERE email = ?", [email]);
		const [res2] = await con.query("SELECT 1 FROM users WHERE mobile = ?", [number]);
		return !(res1.length > 0 || res2.length > 0);
	} catch (err) {
		console.error("Error checking for duplicate user:", err.stack);
		return true; // Handle error appropriately
	}
}
