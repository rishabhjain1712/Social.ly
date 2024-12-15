import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../styles/Register.css';

const ForgotPassword = () => {
    const spans = Array.from({ length: 128 });

    return (
        <section>
            <div className="signup-cont">
                {spans.map((_, index) => (
                    <span key={index} className="span"></span>
                ))}
                <div className="signin" style={{ width: "400px"}}>
                    <div className="content">
                        <h2>Enter Email</h2>
                        <form className="form" >
                            <div className="inputBx">
                                <input
                                    type="email"
                                    placeholder='Enter email'
                                    value=''
                                    required
                                />
                            </div>
                            <div className="links">
                                <Link to={`/login`}>
                                    Login
                                </Link>
                            </div>
                            <div className="inputBx">
                                <button type="submit" >
                                    {/* {loading===true ? 
                                        <span className="spinner"></span> 
                                        :   */}
                                        Submit
                                    {/* } */}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword;
