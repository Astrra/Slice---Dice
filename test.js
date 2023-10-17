const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("./index"); // path to your server file
const should = chai.should();

chai.use(chaiHttp);

describe("API Endpoints", function () {
  let token = "";

  before(function (done) {
    chai
      .request(server)
      .post("/login")
      .send({ username: "Akshay", password: "Akshay@123" })
      .end(function (err, res) {
        if (err) {
          console.error(err);
        }
        token = res.body.token;
        done();
      });
  });

  // Test /add_record endpoint
  it("should add a record", function (done) {
    chai
      .request(server)
      .post("/add_record")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test",
        salary: "5000",
        currency: "USD",
        department: "HR",
        sub_department: "Recruitment",
      })
      .end(function (err, res) {
        res.should.have.status(201);
        res.body.message.should.equal("Record added successfully");
        done();
      });
  });

  // Test /summary_stats/all_salary endpoint
  it("should get summary stats of all salaries", function (done) {
    chai
      .request(server)
      .get("/summary_stats/all_salary")
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.have.property("mean");
        res.body.should.have.property("min");
        res.body.should.have.property("max");
        done();
      });
  });

  // Test /delete_record/:recordIndex endpoint
  it("should delete a record", function (done) {
    const recordIndex = 0;
    chai
      .request(server)
      .delete(`/delete_record/${recordIndex}`)
      .set("Authorization", `Bearer ${token}`)
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.message.should.equal("Record deleted successfully");
        done();
      });
  });

  // Test /summary_stats/on_contract_salary endpoint
  it("should get summary stats of on contract salaries", function (done) {
    chai
      .request(server)
      .get("/summary_stats/on_contract_salary")
      .end(function (err, res) {
        if (res.status === 404) {
          res.body.error.should.equal("No on-contract records found");
        } else {
          res.should.have.status(200);
          res.body.should.have.property("mean");
          res.body.should.have.property("min");
          res.body.should.have.property("max");
        }
        done();
      });
  });

  // Test /summary_stats/department_salary/:department endpoint
  it("should get summary stats of specific department salaries", function (done) {
    const department = "HR";
    chai
      .request(server)
      .get(`/summary_stats/department_salary/${department}`)
      .end(function (err, res) {
        if (res.status === 404) {
          res.body.error.should.equal(
            "No records found for the specified department"
          );
        } else {
          res.should.have.status(200);
          res.body.should.have.property("mean");
          res.body.should.have.property("min");
          res.body.should.have.property("max");
        }
        done();
      });
  });

  // Test /summary_stats/department_sub_department_salary/:department/:sub_department endpoint
  it("should get summary stats of specific department and sub-department salaries", function (done) {
    const department = "HR";
    const subDepartment = "Recruitment";
    chai
      .request(server)
      .get(
        `/summary_stats/department_sub_department_salary/${department}/${subDepartment}`
      )
      .end(function (err, res) {
        if (res.status === 404) {
          res.body.error.should.equal(
            "No records found for the specified department and sub-department"
          );
        } else {
          res.should.have.status(200);
          res.body.should.have.property("mean");
          res.body.should.have.property("min");
          res.body.should.have.property("max");
        }
        done();
      });
  });
});
