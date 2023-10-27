import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import AuthenticationPage from '../pages/AuthenticationPage';
import LoginPage from '../pages/LoginPage';

test('test',()=>{
    expect(true).toBe(true);
})

test('AuthenticationPage-Login', () => {
        render(
            <Router>
                <AuthenticationPage />
            </Router>
        );
        const loginButton = screen.getByTestId('login-button');
        expect(loginButton).toBeInTheDocument();
});

test('AutheticationPage-Login-button', () => {
    render(
        <Router>
            <AuthenticationPage />
        </Router>
    );
    const loginButton = screen.getByTestId('login-button');
    fireEvent.click(loginButton);
    expect(loginButton).toBeInTheDocument();
})


test('AuthenticationPage-Register', () => {
    render(
        <Router>
            <AuthenticationPage />
        </Router>    
    );
    const signupButton = screen.getByTestId('signup-button');
    expect(signupButton).toBeInTheDocument();
});



// test('LoginPage-Email', () => {
//     render(
//         <Router>
//             <LoginPage />
//         </Router>
//     );
//     const emailInput = screen.getByPlaceholderText('Email');
//     expect(emailInput).toBeInTheDocument();
// });
