import express from "express";
import cors from "cors";
import client from "./database.js";
import methodOverride from "method-override";

const app = express();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());

app.get("/server/users", async (req, res) => {
  try {
    const search = req.query.search || "";
    const result = await client.query(
      "SELECT * FROM users WHERE name ILIKE $1 ORDER BY id",
      [`%${search}%`]
    );
    res.render("users", {
      users: result.rows,
      message: req.query.message,
      search,
    });
  } catch (error) {
    res.status(500).send("Error retrieving users");
  }
});
app.post("/server/users", async (req, res) => {
  try {
    const sql =
      "insert into users (name, email, password, role) values ($1, $2, $3, $4)";
    await client.query(sql, [
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.role,
    ]);
    res.redirect("/server/users?message=User added successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});
app.get("/server/users/:id", async (req, res) => {
  try {
    const result = await client.query("select * from users where id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }
    res.render("edit_user", { user: result.rows[0] });
  } catch (error) {
    res.status(500).send("Error retrieving user");
  }
});
app.put("/server/users/:id", async (req, res) => {
  try {
    const sql =
      "update users set name = $1, email = $2, password = $3, role = $4 where id = $5";
    await client.query(sql, [
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.role,
      req.params.id,
    ]);
    res.redirect("/server/users?message=User edited successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});
app.delete("/server/users/:id", async (req, res) => {
  try {
    const sql = "delete from users where id = $1";
    await client.query(sql, [req.params.id]);
    res.redirect("/server/users?message=User deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// app.use((req, res, next) => {
//   console.log("Origin: ", req.headers.origin);
//   next();
// });

app.get("/users", async (req, res) => {
  try {
    const sql = "select * from users order by id";
    const result = await client.query(sql);
    return res.json({ status: "success", data: result.rows });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
});
app.get("/users/:id", async (req, res) => {
  try {
    const sql = "select * from users where id = $1";
    const result = await client.query(sql, [req.params.id]);
    if (result.rows == 0) {
      return res.json({
        status: "error",
        message: "User with id: " + req.params.id + " does not exist",
      });
    }
    return res.json({ status: "success", data: result.rows });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
});
app.post("/users", async (req, res) => {
  try {
    const sql =
      "insert into users (name, email, password, role) values ($1,$2,$3,$4)";
    await client.query(sql, [
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.role,
    ]);
    return res.json({
      status: "success",
      message: "User added",
      data: req.body,
    });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
});
app.put("/users/:id", async (req, res) => {
  try {
    const sql =
      "update users set name=$1, email=$2, password=$3, role=$4 where id = $5";
    await client.query(sql, [
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.role,
      req.params.id,
    ]);
    return res.json({
      status: "success",
      message: "User updated",
      data: req.body,
    });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
});
app.delete("/users/:id", async (req, res) => {
  try {
    const sql = "delete from users where id = $1";
    await client.query(sql, [req.params.id]);
    return res.json({
      status: "success",
      message: "User with id: " + req.params.id + " has been deleted",
    });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
});
app.get("/vouchers", async (req, res) => {
  try {
    const sql = "select * from vouchers order by id";
    const result = await client.query(sql);
    return res.json({ status: "success", data: result.rows });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
});
app.get("/vouchers/:id", async (req, res) => {
  try {
    const sql = "select * from vouchers where id = $1";
    const result = await client.query(sql, [req.params.id]);
    if (result.rows == 0) {
      return res.json({
        status: "error",
        message: "Voucher with id: " + req.params.id + " does not exist",
      });
    }
    return res.json({ status: "success", data: result.rows });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
});
app.post("/vouchers", async (req, res) => {
  try {
    const sql =
      "insert into vouchers (code, discount_type,discount_value,min_order_value,max_discount,usage_limit,start_date,expiry_date) values ($1,$2,$3,$4,$5,$6,$7,$8)";
    await client.query(sql, [
      req.body.code,
      req.body.discount_type,
      req.body.discount_value,
      req.body.min_order_value,
      req.body.max_discount,
      req.body.usage_limit,
      req.body.start_date,
      req.body.expiry_date,
    ]);
    return res.json({ status: "success", data: req.body });
  } catch (error) {
    return res.json({ status: "error", message: error.message });
  }
});
app.put("/vouchers/:id", async (req, res) => {
  try {
    const sql =
      "update vouchers set code = $1, discount_type = $2, discount_value = $3, min_order_value = $4, max_discount = $5, usage_limit = $6, start_date = $7, expiry_date= $8 where id = $9";
    await client.query(sql, [
      req.body.code,
      req.body.discount_type,
      req.body.discount_value,
      req.body.min_order_value,
      req.body.max_discount,
      req.body.usage_limit,
      req.body.start_date,
      req.body.expiry_date,
      req.params.id,
    ]);
    return res.json({
      status: "success",
      message: "Vouchers with id: " + req.params.id + " has been updated",
    });
  } catch (error) {
    return res.json({
      status: "error",
      message: error.message,
    });
  }
});
app.delete("/vouchers/:id", async (req, res) => {
  try {
    const sql = "delete from vouchers where id = $1";
    await client.query(sql, [req.params.id]);
    return res.json({
      status: "success",
      message: "Voucher with id: " + req.params.id + " has been deleted",
    });
  } catch (error) {
    return res.json({ status: "error", message: error.message });
  }
});
app.get("/users_vouchers", async (req, res) => {
  try {
    const sql = "select * from users_vouchers order by id";
    const result = await client.query(sql);
    return res.json({ status: "success", data: result.rows });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
});
app.get("/users_vouchers/:id", async (req, res) => {
  try {
    const sql = "select * from users_vouchers where user_id = $1";
    const result = await client.query(sql, [req.params.id]);
    if (result.rows == 0) {
      return res.json({
        status: "error",
        message: "Does not exist",
      });
    }
    return res.json({ status: "success", data: result.rows });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
});
app.post("/users_vouchers", async (req, res) => {
  try {
    const sql =
      "insert into users_vouchers (user_id, voucher_id) values ($1,$2)";
    for (i in req.body.voucher_ids) {
      await client.query(sql, [req.body.user_id, req.body.voucher_ids[i]]);
    }
    return res.json({
      status: "success",
      message:
        "Vouchers with id: " +
        req.body.voucher_ids +
        "added to user with id: " +
        req.body.user_id,
    });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
});
app.put("/users_vouchers/:id", async (req, res) => {
  try {
    const sql =
      "update users_vouchers set user_id=$1, voucher_id = $2 where id = $3";
    await client.query(sql, [
      req.body.user_id,
      req.body.voucher_id,
      req.params.id,
    ]);
    return res.json({
      status: "success",
      message:
        "Voucher with id: " +
        req.body.voucher_id +
        " of user with id: " +
        req.body.user_id +
        " has been updated",
      data: req.body,
    });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
});
app.delete("/users_vouchers/:user_id/:voucher_id", async (req, res) => {
  try {
    const sql =
      "delete from users_vouchers where user_id = $1 and voucher_id =$2";
    await client.query(sql, [req.params.user_id, req.params.voucher_id]);
    return res.json({
      status: "success",
      message:
        "Voucher with id: " +
        req.params.voucher_id +
        " has been removed from user with id: " +
        req.params.user_id,
    });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
});
app.listen(8000, () => {
  console.log("server is running on port 8000");
});
