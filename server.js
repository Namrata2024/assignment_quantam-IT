const express = require("express");
const bcrypt = require("bcryptjs");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
app.use(express.json());

app.use(cors());

const uri= "mongodb+srv://namrata250602:namu234@cluster0.vatgthq.mongodb.net/";
const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";
mongoose
  .connect(uri, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));




app.post("/post", async (req, res) => {
    console.log(req.body);
    const { data } = req.body;
    try {
        if (data == "namrata") {
            res.send({ status: "ok" });
        } else {
            res.send({ status: "user not found" });
        }
    }
    catch (e) {
        res.send({ status: "error" });
    }
});

require("./userDetails");

const User = mongoose.model("UserInfo");

app.post("/register", async (req, res) => {
    const { fname, lname, dob, email, password ,userType} = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
         const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
        await User.create({
            fname,
            lname,
            dob,
            email,
            
            password: encryptedPassword,
            userType,
        });
        res.send({ status: "ok" });
    } catch (error) {
        res.send({ status: "error" });
      
    }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "15m",
    });

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "InvAlid Password" });
});


app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    console.log(user);
    if (user == "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }

    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) { }
});
app.listen(5000,()=> {
    console.log("i am listening");
})

app.get("/getAllUser", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
  }
});

app.post("/deleteUser", async (req, res) => {
  const { userid } = req.body;
  try {
    User.deleteOne({ _id: userid }, function (err, res) {
      console.log(err);
    });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.log(error);
  }
});

app.get("/paginatedUsers", async (req, res) => {
    const allUser = await User.find({});
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1) * limit
    const lastIndex = (page) * limit

    const results = {}
    results.totalUser = allUser.length;
    results.pageCount = Math.ceil(allUser.length / limit);

    if (lastIndex < allUser.length) {
        results.next = {
            page: page + 1,
        }
    }
    if (startIndex > 0) {
        results.prev = {
            page: page - 1,
        }
    }
    results.result = allUser.slice(startIndex, lastIndex);
    res.json(results)
});
