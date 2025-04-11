$(function () {
    $('#registrationForm').on('submit', function (event) {
        event.preventDefault();
        var formData = {
            name: $('#name').val(),
            email: $('#email').val(),
            phone_number: $('#phone_number').val(),
            password: $('#password').val(),
        }
        fetch('http://127.0.0.1:8000/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)

        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    $('#response-message').html('<p>Registration successful!</p>');
                } else {
                    $('#response-message').html('<p>Error: ' + data.message + '</p>');
                }
            })
            .catch(error => {
                $('#response-message').html('<p>An error occurred: ' + error.message + '</p>');
            });
    });
})
// loginpage
$(function () {
    $('#loginform').on('submit', function (event) {
        event.preventDefault();
        var formData = {
            email: $('#email').val(),
            password: $('#password').val(),
        }

        fetch('http://127.0.0.1:8000/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(formData)

        })
            .then(response => response.json())
            .then(data => {
                console.log("Server response:", data);
                if (typeof data.access === 'string' && typeof data.refresh === 'string') {
                    console.log("Saving token to localStorage:", data.access, data.refresh);
                    localStorage.setItem('access_token', data.access);
                    localStorage.setItem('refresh_token', data.refresh);
                    $('#response-message').html('<p>Login successful!</p>');
                    setTimeout(() => {
                        window.location.href = "home.html";
                    }, 500);
                } else {
                    $('#response-message').html('<p>Error: ' + data.message + '</p>');
                }
            })
            .catch(error => {
                $('#response-message').html('<p>An error occurred: ' + error.message + '</p>');
            });
    });
})
//logoutpage
$(function () {
    $('#logout').on('click', function (event) {
        event.preventDefault();
        const refreshToken = localStorage.getItem('refresh_token')
        const accessToken = localStorage.getItem('access_token')
        if (!refreshToken || !accessToken) {
            console.log('No refresh token found');
            return;
        }


        fetch('http://127.0.0.1:8000/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ refresh: refreshToken })
        })
            .then(response => {
                console.log(response);
                if (response.ok) {
                    console.log('Logout SuccessFul');
                    window.location.href = "login.html";
                }
                else {
                    console.log('Logout Failed', response.statusText);
                }

            })
            .catch(error => {
                console.error('Error:', error);
            });
    });




})

$(function () {
    $('#resetrequestform').on('click', function (event) {
        event.preventDefault();
        const email = $('#email').val().trim();
        console.log('email', email)

        fetch(`http://127.0.0.1:8000/password_reset/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'email': email,
            })

        })
            .then(response => response.json())
            .then(data => {
                console.log('data:', data);
                if (data.success) {
                    $('#responseMessage').text(data.success).css("color", "green");
                }
                else {
                    $('#responseMessage').text(data.error).css("color", "red");
                }
            })
            .catch(error => {
                console.error('Error:', error);
            })


    })
})


$(function () {
    $('#restpasswordform').on('submit', function (event) {
        event.preventDefault();
        const password = $('#newpassword').val().trim();
        const confirmpassword = $('#confirmpassword').val().trim();
        const urlParams = new URLSearchParams(window.location.search)
        const tokenFromUrl = urlParams.get('token')
        if (!tokenFromUrl) {
            console.log('token is not provided')
        }

        console.log('token', tokenFromUrl)
        console.log('password', password)
        console.log('confirmPassword', confirmpassword)
        if (password !== confirmpassword) {
            $('#responseMessage').text('Passwords do not match').css("color", "red");
        }
        fetch(`http://127.0.0.1:8000/password_reset/confirm/${tokenFromUrl}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password,
                confirmpassword: confirmpassword


            })
        })
            .then(response => response.json())
            .then(data => {
                console.log('data:', data);
                if (data.success) {
                    $('#responseMessage').text(data.success).css("color", "green");
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                }
                else {
                    $('#responseMessage').text(data.error).css("color", "red");
                }
            })
            .catch(error => {
                console.error('Error:', error);

            })
    })
})



//home.html
$(function () {
    // // $('#nav-left').on('click', function (event) {
    // //     event.preventDefault();
    // //     window.location.href = "productlisting.html";
    // })
    $('#nav-left').hover(
        function () {
            $(this).css('cursor', 'pointer');
        },
        function () {
            $(this).css('cursor', 'hand');
        }
    );
    $('#nav-right').hover(
        function () {
            $(this).css('cursor', 'pointer');
        },
        function () {
            $(this).css('cursor', 'hand');
        }
    );






    // if (token) {
    //     fetch('http://127.0.0.1:8000/categories/', {
    //         method: 'GET',
    //         headers: {
    //             'Authorization': 'Bearer ${token}'
    //         }
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log(data);
    //              navMenu = $('#navMenu');

    //             navMenu.empty();


    //             data.forEach(category => {
    //                  listItem = $('<li>').text(category.name).attr('id', category.id);
    //                 navMenu.append(listItem);
    //             });
    //         })
    //         .catch(error => {
    //             console.error('Error fetching data:', error);

    //         });
    // } else {
    //     console.log('No token found in sessionStorage.');
    // }
})

// $(function () {
//     fetch('http://127.0.0.1:8000/cart-items/', {
//         method: 'GET',
//         headers: {
//             'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxMzYzMDQ5LCJpYXQiOjE3NDEzNTk0NDksImp0aSI6IjllOTZhOGM3ZWI1YTQ0ZDU5YzU3YjM2NTdlN2I4ZjY2IiwidXNlcl9pZCI6OX0.KL8nI_iat8JTgFOC7rBbYGSfUxany5beT27qLRcOa1o'
//         }
//     })
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//              navMenu = $('.cart-items');

//             navMenu.empty();


//             data.forEach(Cart_items => {
//                  listItem = $('<li>').text(cart - items.name).attr('id', cart - items.id);
//                 navMenu.append(listItem);
//             });
//         })
//         .catch(error => {
//             console.error('Error fetching data:', error);
//         });
// })
$(function () {
    $('#fashion').on('click', function (event) {
        event.preventDefault();
        window.location.href = "fashion.html"
    })
    $('#electronic').on('click', function (event) {
        event.preventDefault();
        window.location.href = "electronic.html"
    })
    $('#home').on('click', function (event) {
        event.preventDefault();
        window.location.href = "homecate.html"
    })
    $('#toys').on('click', function (event) {
        event.preventDefault();
        window.location.href = "toys.html"
    })
    $('#beauty').on('click', function (event) {
        event.preventDefault();
        window.location.href = "beauty.html"
    })
    $('#appliances').on('click', function (event) {
        event.preventDefault();
        window.location.href = "appliances.html"
    })
})
$(function () {
    $('#cart').on('click', function (event) {
        event.preventDefault();
        window.location.href = "cart.html"
    })

})
$(function () {
    $('#btn1').on('click', function (event) {
        event.preventDefault();
        window.location.href = "cart.html"
    })

})




$(function () {
    $('#saveaddress').on('click', function (event) {
        event.preventDefault();
        window.location.href = "savedaddress.html"
    })
})
$(function () {
    $('#profile').on('click', function (event) {
        event.preventDefault();
        window.location.href = "profile.html"
    })

})
$(function () {
    $('#orders').on('click', function (event) {
        event.preventDefault();
        window.location.href = "getorder.html"
    })

})
$(function () {
    $('#cart').on('click', function (event) {
        event.preventDefault();
        window.location.href = "cart.html"
    })

})
$(function () {
    $('#sav').on('click', function (event) {
        event.preventDefault();
        window.location.href = "address.html"
    })

})
// saveaddresspost
$(function () {
    $('#save').click(function () {
        var formData = {
            name: $('#name').val(),
            address: $('#address').val(),
            city: $('#city').val(),
            state: $('#state').val(),
            zipcode: $('#pincode').val(),
            landmark: $('#landmark').val(),
        }

        console.log('hi')

        const accessToken = localStorage.getItem('access_token');
        console.log(accessToken)


        fetch('http://127.0.0.1:8000/addresses/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                alert('Address saved successfully')
                window.location.href = 'savedaddress.html';


            })
        $('#cancel').click(function () {
            $('#name').val('');
            $('#mobile').val('');
            $('#pincode').val('');
            $('#state').val('');
            $('#address').val('');
            $('#city').val('');
            $('#landmark').val('');
        });
    });
});








