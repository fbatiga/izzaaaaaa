angular.module('izza.app.controllers', ['ui.rCalendar'])

.controller('AppCtrl', function ($scope, AuthService, $localStorage) {

    //this will represent our logged user

    //save our logged user on the localStorage
    $scope.loggedUser = $localStorage.profile;
})


.controller('ProfileCtrl', function ($scope, $stateParams, $localStorage, $sessionStorage, $ionicHistory, $state, $ionicScrollDelegate, ProfileService, $ionicLoading) {

    $scope.profile = $localStorage.profile;
    // console.log($scope.profile);



    $scope.logOut = function () {
        $ionicLoading.show();
        delete $localStorage.token;
        delete $localStorage.customer_id;
        delete $localStorage.stripe_id;
        delete $localStorage.profile;
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $ionicLoading.hide();
        $state.go('auth.login');
    }
    $scope.gotoLegal = function () {
        $state.go("app.legal.legal-notice");
    };
})

.controller('BookingsController', function ($scope, BookingsService, $ionicPopup, $ionicModal, $state, $ionicHistory, $localStorage, $sessionStorage, $ionicLoading) {

    $scope.profile = $localStorage.profile;
    $scope.customer_id = $localStorage.customer_id;
    $scope.isSelected = true;
    /*
    PLACEHOLDER VALUE FOR RESERVATIONS (FRONT END DEV AND TESTING ONLY)
    */

    $scope.$on('$ionicView.enter', function () {
        $ionicLoading.show();
        BookingsService.getReservations($scope.customer_id)
        .success(function (response) {
            $ionicLoading.hide();
            $scope.reservations = response;
            // console.log('getting Reservation from Server')
        })
        .error(function (error) {
            $ionicLoading.hide();
            console.log('Error loading providers...' + error);
        });
    });
    //Turns the booking into status:canceled

    $scope.cancelBooking = function (res_id) {
        $ionicPopup.confirm({
            title: 'Annulation',
            template: 'Attention vous allez annuler votre réservation.',
            cancelText: 'Annuler'
        }).then(function (res) {
            // console.log("cancelling booking id: " + res_id);
            if (res) {
                $scope.currentID = res_id;
                $ionicLoading.show();
                BookingsService.cancelBooking(res_id)
                .success(function (response) {
                    $scope.doRefresh();
                })
                .error(function (error) {
                    $ionicLoading.hide();
                    console.log('Error Cancelling...' + JSON.stringify(error));
                    $ionicPopup.alert({
                        title: 'Annulation',
                        template: error.message.error
                    }).then(function (res) {
                        $ionicLoading.show();
                        $scope.doRefresh();
                    })
                });
            }
        });
    };

    $scope.doRefresh = function () {
        BookingsService.getReservations($scope.customer_id)
        .success(function (response) {
            $scope.reservations = response;
            $ionicLoading.hide();
        })
        .error(function (error) {
            $ionicLoading.hide();
            console.log('Error loading providers...' + error);
        })
        $scope.$broadcast('scroll.refreshComplete');
    };

})

.controller('BookCtrl', function ($scope, $http, $state, BookingsService, RemoteDirectory, $ionicModal, $ionicPopup, lodash, $filter, $ionicScrollDelegate, $localStorage, $ionicLoading) {
    // console.log($localStorage.customer_id);
    $scope.groups = [];

    // $ionicLoading.show();
    BookingsService.getCategories().then(function (response) {
        $scope.groups = response.data;
        // $ionicLoading.hide();
    })
    $scope.openGroup = function (group) {
        $scope.myPopup = $state.go('app.book.category', { groupInfo: group });
    }

    var myPopup;
    $scope.showFiltersPopup = function () {
        $scope.filter = {};
        myPopup = $ionicPopup.show({
            cssClass: 'filter-popup',
            templateUrl: 'views/app/book/partials/filters_popup.html',
            scope: $scope,
        });
        myPopup.then(function (res) {
            if (res) {
                // console.log('Filters applied', res);
                myPopup.close();
            } else {
                // console.log('Popup closed');
                myPopup.close();
            }
        });
    };
    $scope.closePopup = function () {
        myPopup.close();
    }
    $scope.applyFilter = function () {
        myPopup.close();
    }
})

.controller('SubCategoryCtrl', function ($scope, $state, BookingsService, $ionicModal, $ionicPopup, $timeout, lodash, $filter, $stateParams, $ionicScrollDelegate, $localStorage) {
    $scope.group = $stateParams.groupInfo;
    $scope.subgroups = $scope.group.subcategories;

    //    $scope.subgroups[0] = {
        //        name: 'Coupe',
        //        img: 'img/subgroups/coupe.jpg'
        //    };
        //    $scope.subgroups[1] = {
            //        name: 'Tresses',
            //        img: 'img/subgroups/tresses.jpg'
            //    };
            //    $scope.subgroups[2] = {
                //        name: 'Brushing',
                //        img: 'img/subgroups/brushing.jpg'
                //    };
                // console.log($ionicScrollDelegate);
                $scope.toggleGroup = function (group) {
                    // console.log("scroll resize");

                    if ($scope.isGroupShown(group)) {
                        $scope.shownGroup = null;
                    } else {
                        $scope.shownGroup = group;
                    }
                    $ionicScrollDelegate.resize();
                    $timeout(function () {
                        $ionicScrollDelegate.resize();
                    }, 500);
                };
                $scope.isGroupShown = function (group) {
                    return $scope.shownGroup === group;
                };

                $scope.openService = function (service) {
                    // console.log("scroll resize");
                    $state.go('app.book.providers_list', { serviceInfo: service });
                }
                //
                //    var myPopup;
                //    $scope.showFiltersPopup = function() {
                    //        $scope.filter = {};
                    //        myPopup = $ionicPopup.show({
                        //            cssClass: 'filter-popup',
                        //            templateUrl: 'views/app/book/partials/filters_popup.html',
                        //            scope: $scope,
                        //        });
                        //        myPopup.then(function(res) {
                            //            if (res) {
                                //                console.log('Filters applied', res);
                                //                myPopup.close();
                                //            } else {
                                    //                console.log('Popup closed');
                                    //                myPopup.close();
                                    //            }
                                    //        });
                                    //    };
                                    //    $scope.closePopup = function() {
                                        //        myPopup.close();
                                        //    }
                                        //    $scope.applyFilter = function() {
                                            //        myPopup.close();
                                            //    }
                                        })

.controller('ProvidersCtrl', function ($scope, $state, $stateParams, $ionicLoading, BookingsService, $ionicModal, $timeout, $ionicPopup, lodash, $filter, $ionicScrollDelegate, $localStorage) {

    $scope.service = $stateParams.serviceInfo;
    $scope.reservation = {
        providerservice: "",
        customer: $localStorage.customer_id,
        date: Date(),
        hour: "",
        status: "In Progress",
        address: $localStorage.profile ? $localStorage.profile.address : "",
        note: "",
        token: $localStorage.token
    };
    $scope.recap_info = {
        service: "",
        provider_name: "",
        date: "",
        hour: ""
    }
    // console.log($scope.service._id);
    $ionicLoading.show();
    BookingsService.getProviders($scope.service._id).success(function (response) {
        $ionicLoading.hide();
        $scope.providers = response;
        $ionicScrollDelegate.resize();
        for (i in $scope.providers) {
            var provider = $scope.providers[i];
            for (var j = 0, ln = provider.services.length; j < ln; j++) {
                if (provider.services[j].id == $scope.service._id && provider.services[j].pics && provider.services[j].pics[0]) {
                    provider.picture = provider.services[j].pics[0];
                }
            }
        }
        $ionicScrollDelegate.resize();
        $timeout(function () {
            $ionicScrollDelegate.resize();
        }, 500);
    }).error(function (error) {
        $ionicLoading.hide();
        console.log('Error loading providers...' + error);
    })
    //      .then(function(response) {
        //        $scope.providers = response.data;
        //    })


        $scope.bookPerService = function (provider) {
            // console.log($scope.recap_info);
            $scope.recap_info.provider_name = provider.firstname + ' ' + provider.lastname;
            $state.go('app.book.provider', { providerInfo: provider, reservationInfo: $scope.reservation, recapInfo: $scope.recap_info });
        };
    })

.controller('BookProviderCtrl', function ($scope, $ionicLoading, BookingsService, $ionicPopup, $state, ionicDatePicker, $stateParams, $localStorage) {

    $scope.provider = $stateParams.providerInfo;
    // console.log($scope.provider);
    $scope.reservation = $stateParams.reservationInfo;
    $scope.recap_info = $stateParams.recapInfo;

    $scope.sliderImages = [];

    angular.forEach($scope.provider.services, function (value, key) {
        $scope.sliderImages = $scope.sliderImages.concat(value.pics)
    });

    // console.log($scope.sliderImages);


    $scope.reservation.providerservice = "";
    // console.log($scope.reservation.providerservice);
    //    $scope.reservation.provider = $scope.provider.firstname + " " + $scope.provider.lastname;
    $scope.selection = [];
    $scope.toggleSelection = function toggleSelection(single_service) {
        var idx = $scope.selection.indexOf(single_service);
        // console.log($scope.selection);
        // Is currently selected
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        }
        // Is newly selected
        else {
            $scope.selection.push(single_service);
        }
    };

    // console.log($scope.reservation.providerservice);
    // console.log($scope.recap_info.service);

    $scope.selectService = function (providerservice) {
        // console.log(providerservice);
        // if(providerservice.pics.length > 0){
            //     $scope.imageUrl = providerservice.pics[0];
            // }else{
                //     $scope.imageUrl = $scope.provider.picture;
                // }
                $scope.reservation.providerservice = providerservice._id;
                $scope.recap_info.service = providerservice.service.title;
                $scope.recap_info.price = providerservice.price;

            }
            // console.log($scope.reservation);
            $scope.continuetoDate = function (provider) {
                //        $scope.reservation.providerservice = $scope.selection[0]._id;
                //        $scope.recap_info.service = $scope.selection[0].service.title;
                //        $scope.recap_info.price = $scope.selection[0].price;
                $state.go('app.book.addbooking', { providerInfo: provider, reservationInfo: $scope.reservation, recapInfo: $scope.recap_info });
            };
        })

.controller("PickBookingTimeCtrl", function ($scope, $filter, $stateParams, ionicDatePicker, ionicTimePicker, $location, $state, BookingsService, $ionicModal, $localStorage, $sessionStorage, $ionicPopup, $ionicHistory, $localStorage) {

    $scope.params = $stateParams;
    $scope.reservation = $stateParams.reservationInfo;
    $scope.recap_info = $stateParams.recapInfo;
    $scope.reservation.hour = "";

    var caldate = new Date();
    $scope.reservation.date = caldate;
    $scope.recap_info.date = caldate;
    $scope.showdate = $filter('date')(caldate, 'dd/MM/yyyy');
    $scope.showmonth = $filter('date')(caldate, 'MMMM yyyy');
    $scope.showday = $filter('date')(caldate, 'EEEE d');
    // console.log($scope.reservation.hour);
    //        $scope.showday = "";
    //        $scope.showmonth = "Choisir la date";

    $scope.pickedServices = $scope.provider;

    //range function for the timepicker
    $scope.range = function (min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) {
            input.push(i);
        }
        return input;
    };
    $scope.ipObjDatePicker = {
        callback: function (val) { //Mandatory
            var caldate = new Date(val);
            // console.log('Return value from the datepicker popup is : ' + caldate);
            $scope.reservation.date = caldate;
            $scope.recap_info.date = caldate;
            // console.log($scope.reservation);
            $scope.showdate = $filter('date')(caldate, 'dd/MM/yyyy');
            $scope.showmonth = $filter('date')(caldate, 'MMMM yyyy');
            $scope.showday = $filter('date')(caldate, 'EEEE d');
        },
        //from: new Date(2012, 1, 1), //Optional
        //to: new Date(2016, 10, 30), //Optional
        inputDate: new Date(), //Optional
        mondayFirst: true, //Optional
        disableWeekdays: [0], //Optional
        closeOnSelect: true, //Optional
        templateType: 'modal', //Optional
        closeLabel: 'Choisir',
        titleLabel: 'Choisissez une date',
        weeksList: ["D", "L", "M", "M", "J", "V", "S"],
        monthsList: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"],
    };

    $scope.openDatePicker = function () {
        ionicDatePicker.openDatePicker($scope.ipObjDatePicker);
    };

    $scope.profile = $localStorage.profile;

    $scope.selectTimeRange = function (from, to) {

        $scope.reservation.hour = from + 'h' + '00';
        $scope.recap_info.hour = from + 'h' + '00';

    }

    $filter('date')(Date(), 'dd/MM/yyyy');
    $scope.provider = $stateParams.providerInfo;

    $scope.confirmBooking = function (provider) {
        $state.go('app.book.address', { providerInfo: provider, reservationInfo: $scope.reservation, recapInfo: $scope.recap_info });
    };
})

.controller('BookAddressCtrl', function ($scope, BookingsService, $ionicPopup, $state, ionicDatePicker, $stateParams, $localStorage) {

    $scope.provider = $stateParams.providerInfo;
    $scope.reservation = $stateParams.reservationInfo;
    $scope.recap_info = $stateParams.recapInfo;

    $scope.confirmBooking = function (provider) {
        $state.go('app.book.recap', { providerInfo: provider, reservationInfo: $scope.reservation, recapInfo: $scope.recap_info });
    };
})

.controller('BookRecapCtrl', function ($scope, BookingsService, sharedFunctions, $ionicPopup, $state, ionicDatePicker, $stateParams, $localStorage, $ionicModal, $ionicLoading) {

    $scope.isLoading = false;
    $scope.hasLoaded = false;
    $scope.provider = $stateParams.providerInfo;
    $scope.reservation = $stateParams.reservationInfo;
    $scope.recap_info = $stateParams.recapInfo;

    $scope.fees_info = { customer: $localStorage.customer_id, date: $scope.reservation.date };
    $ionicLoading.show();
    BookingsService.getFees($scope.fees_info)
    .success(function (response) {
        $ionicLoading.hide();
        $scope.fees = response.fee;
    }).error(function (error) {
        $ionicLoading.hide();
        console.log('Error loading fees...' + error);
    });



    $scope.selectCard = function (card) {
        // console.log(card);
        $scope.cardToPay = card;
    }

    $scope.refreshCards = function () {
        $scope.cardToPay = true;
        $ionicLoading.show();
        BookingsService.getCards($localStorage.stripe_id)
        .success(function (response) {
            $ionicLoading.hide();
            $scope.hasLoaded = true;
            $scope.cardToPay = false;
            $scope.cards = response.data;
            if ($scope.cards && $scope.cards.length > 0) {
                $scope.selectCard($scope.cards[0]);
            }
        })
        .error(function (error) {
            $ionicLoading.hide();
            $scope.hasLoaded = true;
            $scope.cardToPay = false;
            console.log('Error loading cards...' + error);
        });
    }
    $scope.refreshCards()



    $ionicModal.fromTemplateUrl('views/app/book/partials/cards-list.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.cards_list_modal = modal;
    });

    $scope.showCards = function () {
        $scope.cards_list_modal.show();
    };

    $ionicModal.fromTemplateUrl('views/app/book/partials/new-card.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.new_card_modal = modal;
    });

    $scope.newCardForm = {};
    $scope.newCard = function () {
        $scope.new_card_modal.show();
        $ionicLoading.show({duration:20000});
        // console.log('Modal is shown!');
        ///////   STRIPE ELEMENTS   //////
        var stripe = Stripe('pk_test_calia0re9s1xfre0GjtltI8i');
        var elements = stripe.elements({ locale: "fr" });
        var style = {
            base: {
                iconColor: '#666EE8',
                color: '#31325F',
                lineHeight: '40px',
                fontWeight: 300,
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '15px',
                '::placeholder': {
                    color: '#bec7d0',
                },
            },
            invalid: {
                iconColor: '#e85746',
                color: '#e85746',
            }
        }
        var classes = {
            focus: 'is-focused',
            empty: 'is-empty',
        }
        var cardNumber = elements.create('cardNumber', {
            iconStyle: 'solid',
            style: style,
            classes: classes,
        });
        cardNumber.mount('#cardNumber-element');

        var cardExpiry = elements.create('cardExpiry', {
            iconStyle: 'solid',
            style: style,
            classes: classes,
        });
        cardExpiry.mount('#cardExpiry-element');

        var cardCvc = elements.create('cardCvc', {
            iconStyle: 'solid',
            style: style,
            classes: classes,
        });
        cardCvc.mount('#cardCvc-element');

        var inputs = document.querySelectorAll('input.field');
        Array.prototype.forEach.call(inputs, function (input) {
            input.addEventListener('focus', function () {
                input.classList.add('is-focused');
            });
            input.addEventListener('blur', function () {
                input.classList.remove('is-focused');
            });
            input.addEventListener('keyup', function () {
                if (input.value.length === 0) {
                    input.classList.add('is-empty');
                } else {
                    input.classList.remove('is-empty');
                }
            });
        });

        function setOutcome(result) {
            var errorElement = document.querySelector('.error');
            errorElement.classList.remove('visible');

            if (result.token) {
                // Use the token to create a charge or a customer
                // https://stripe.com/docs/charges
                // console.log(result.token.id);
                $scope.new_card_modal.hide();
                $scope.new_card_info = { customerId: $localStorage.stripe_id, token: result.token.id };
                // console.log($scope.new_card_info);
                BookingsService.sendCard($scope.new_card_info)
                .then(
                      function (response) {
                        // console.log("Success!");
                        $scope.refreshCards();
                    },
                    function (error) {
                        console.log(error);
                    }
                    );
            } else if (result.error) {
                console.log(result.error.message);
                errorElement.textContent = result.error.message;
                errorElement.classList.add('visible');
            } else {
                errorElement.textContent = '';
            }
        }

        cardNumber.on('ready', function (event) {
            $ionicLoading.hide();
        });
        cardNumber.on('change', function (event) {
            setOutcome(event);
        });
        cardExpiry.on('change', function (event) {
            setOutcome(event);
        });
        cardCvc.on('change', function (event) {
            setOutcome(event);
        });



        $scope.addCard = function () {
            var form = document.querySelector('form');
            var extraDetails = {
                name: $scope.newCardForm.name.$modelValue,
            };
            stripe.createToken(cardNumber, extraDetails).then(setOutcome);

        };
        ///////       END         //////
    };


    /////// Confirm booking //////
    $scope.confirmBooking = function () {
        $scope.reservation.cardid = $scope.cardToPay.id;
        // console.log($scope.cardToPay, $scope.reservation);
        $ionicLoading.show({duration:10000});
        BookingsService.createReservation($scope.reservation).then(function (res) {
            $ionicLoading.hide();
            // console.log(res);
            var alertPopup = $ionicPopup.alert({
                title: 'Réservation',
                template: 'Votre demande de rendez-vous à bien été prise en compte.'
            });
            alertPopup.then(function (res) {
                sharedFunctions.goToBookings();
            }, function (err) {
                $ionicLoading.hide();
                console.warn(err);
            });
        },
        function (err) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'Réservation',
                template: "Il y a eu une erreur lors du paiement. Merci de vérifier votre carte ou votre connexion internet"
            });
            console.warn(err);
        }
        );
    };
})

.controller('LegalCtrl', function ($scope, $ionicModal) {
    //$ionicConfigProvider.backButton.previousTitleText() = false;
    $ionicModal.fromTemplateUrl('views/app/legal/terms-of-service.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.terms_of_service_modal = modal;
    });

    $ionicModal.fromTemplateUrl('views/app/legal/privacy-policy.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.privacy_policy_modal = modal;
    });

    $scope.showTerms = function () {
        $scope.terms_of_service_modal.show();
    };

    $scope.showPrivacyPolicy = function () {
        $scope.privacy_policy_modal.show();
    };
})
