//Решение первой части задания

'use strict';

class Profile {
    constructor({username, name: {firstName, lastName}, password}) {
        this.username = username;
        this.name = {
            firstName,
            lastName
        }
        this.password = password;
    }
    
    createUser(callback) {
        return ApiConnector.createUser(
            {
                username: this.username,
                name: this.name,
                password: this.password
            }, (err,data) => {
            console.log(`User ${this.username} created`);
            callback(err, data);
            }
        )
    }

    userLogin(callback) {
        return ApiConnector.performLogin(
            {
                username: this.username,
                password: this.password
            }, (err, data) => {
                console.log(`User ${this.username} authorized`);
                callback(err, data);
            }
        )
    }

    addMoney({currency, amount}, callback) {
        return ApiConnector.addMoney({currency, amount}, (err,data) => 
            {
                console.log(`${this.username} added ${amount} ${currency} dgdg`);
                callback(err, data);
            }
        )
    }

    currencyExchange({fromCurrency, targetCurrency, targetAmount}, callback) {
            return ApiConnector.convertMoney({fromCurrency, targetCurrency, targetAmount}, (err, data) =>
            {
                console.log(`${fromCurrency} exchanged to ${targetAmount} ${targetCurrency}`);
                callback(err, data);
            }
        )
    }

    transferMoney({to, amount}, callback) {
        return ApiConnector.transferMoney({to, amount}, (err, data) =>
            {
            console.log(`Transfer ${amount} to ${to}`);
            callback(err, data);
            }
        )
    }
}

function getStocks(callback) {
    return ApiConnector.getStocks((err, data) => 
        {
        console.log(`Current stocks`);
        callback(err, data);
        }
    )
}



// решение второй части

function main() {

    let courses;
    getStocks((err, data) => {
        if (err) {
            console.log('ERROR');
        }
        courses = data[99].RUB_NETCOIN;
    });
    
    

    const user1 = new Profile(
        {
            username: 'Vanya',
            name: {firstName: 'Ivan', lastName: 'Ivanov'},
            password: 'user1pass'
        }
    );

    const user2 = new Profile(
        {
            username: 'Petya',
            name: {firstName: 'Petr', lastName: 'Petrov'},
            password: 'user2pass'
        }
    );
//создаём пользователя
    user1.createUser((err, data) => {
        if (err) {
            console.log(err);
            console.error(`Error during creating ${user1.username}`);
        } else {
            console.log(`User ${user1.username} successfully created`);
                //логиним юзера
            user1.userLogin( (err, data) => {
                if (err) {
                    console.error(`Error during authorization ${user1.username}`);
                } else {
                    console.log(`User ${user1.username} successfully logged in`);
                    //добавляем денег в кошелек
                    let amount = 50000;
                    let currency = 'RUB';
                    user1.addMoney({ currency: currency, amount: amount },(err, data) => {
                        if (err) {
                            console.error('Error while adding money');
                        } else {
                            console.log(`${user1.username} added ${amount} ${currency}`);
                            //конвертация валют
                            let targetAmount = amount * courses;
                            user1.currencyExchange({fromCurrency: currency, targetCurrency: 'NETCOIN', targetAmount: targetAmount}, (err, data) => {
                                if (err) {
                                    console.log(err)
                                    console.error(`Error converting money from RUB to NETCOIN`);
                                } else {
                                    console.log(`Successfully converted`);
                                    user2.createUser( (err, data) => {
                                        if (err) {
                                            console.log(err);
                                            console.error(`Error during creating ${user2.username}`);
                                        } else {
                                            console.log(`User ${user2.username} successfully created`);
                                            console.log(targetAmount);
                                            user1.transferMoney({to: user2.username, amount: targetAmount}, (err, data) => {
                                                if (err) {
                                                    console.log(err);
                                                    console.error('Transfer failed');
                                                } else {
                                                    console.log(`${user2.username} delivered ${targetAmount} NETCOINS successfully`);
                                                }
                                            });            
                                        }
                                    });    
                                }
                            });                
                        }
                    });                    
                }
            });        
        }
    });
}

main();