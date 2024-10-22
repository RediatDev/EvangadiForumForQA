import { useState, useEffect } from "react";
import "./LogInSignUp.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Checkbox, FormGroup } from "@mui/material";
import {Link} from "react-router-dom"
function LogInSignUp() {
  const [countries, setCountries] = useState([]);
  const [gender, setGender] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch country data from API
    const fetchCountries = async () => {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const data = await response.json();
      setCountries(data.map((country) => country.name.common)); // Adjust according to the API response
    };

    fetchCountries();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    if (!agreedToTerms) {
      alert("You must agree to the terms and conditions.");
      return;
    }
    // Proceed with form submission
  };

  return (
    <div className="loginSignUp">
      <div id="carouselExample" className="carousel slide">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="login">
              <h5>Login to your account</h5>
              <div>
                Don’t have an account?{" "}
                <span
                  type="button"
                  data-bs-target="#carouselExample"
                  data-bs-slide="prev"
                >
                  Create a new account
                </span>
              </div>
              <form>
                <div className="form-input">
                  <input type="email" placeholder="Email address" />
                </div>
                <div className="form-input password">
                  <input
                    type={show ? "text" : "password"}
                    placeholder="Password"
                  />
                  <span onClick={() => setShow((prev) => !prev)}>
                    {show ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                  </span>
                </div>
                <div className="forgot">
                  <Link to="">Forgot password?</Link>
                </div>
                <div className="btn-login">
                  <button
                    disabled={loading}
                    className={`${loading && "disabled"}`}
                    type="submit"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="carousel-item">
            <div className="register">
              <h5>Join the network</h5>
              <div>
                Already have an account?{" "}
                <span
                  type="button"
                  data-bs-target="#carouselExample"
                  data-bs-slide="next"
                >
                  Sign in
                </span>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-input">
                  <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    required
                  />
                </div>
                <div className="row">
                  <div className="form-input col-md-6">
                    <input type="text" placeholder="First name" required />
                  </div>
                  <div className="form-input col-md-6">
                    <input type="text" placeholder="Last name" required />
                  </div>
                </div>
                <div className="form-input">
                  <input type="email" placeholder="Email address" required />
                </div>
                <div className="form-input">
                  <select className="" required>
                    <option value="" disabled selected>
                      Select your country
                    </option>
                    {countries.map((country, index) => (
                      <option
                        key={index}
                        value={country}
                        className={index % 2 === 0 ? "light-silver" : ""}
                      >
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Male"
                    />
                  </RadioGroup>
                </FormControl>

                <div className="form-input password">
                  <input
                    type={show ? "text" : "password"}
                    placeholder="Password"
                    required
                  />
                  <span onClick={() => setShow((prev) => !prev)}>
                    {show ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                  </span>
                </div>
                <div className="privacy">
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label={
                        <span className="forSpan">
                          <span className="agree-text">I agree to the </span>
                          <Link to="/privacy-policy">Privacy Policy</Link>

                          <span className="agree-text"> and </span>
                          <Link    to="/terms-of-service">terms of service</Link>

                          .
                        </span>
                      }
                    />
                  </FormGroup>
                </div>
                <div className="btn-register">
                  <button type="submit">Agree and Join</button>
                </div>
                <div>
                  <span
                    type="button"
                    data-bs-target="#carouselExample"
                    data-bs-slide="next"
                  >
                    Already have an account?
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogInSignUp;
