(function($) {
    function openDeleteModalWindow(modalWindowType) {
        if (modalWindowType !== 'delete') {
            return
        } else {
            setTimeout(() => {
                const postButton = $('.post__button_item_delete');
                postButton.click(function() {
                    $('.delete__popup-wrapper').fadeIn();
                })
                closeModalWindow();
            }, 1000);
        }
    }

    function closeModalWindow() {

        const popupCloseBtn = $('.popup__close__btn');
        popupCloseBtn.click(function() {
            $('.popup-wrapper').fadeOut();
        })

        const okBtn = $('.popup__button_ok');
        okBtn.click(function() {
            $('.popup-wrapper').fadeOut();
            console.log("Ok")
        })

        const cancelBtn = $('.popup__button_cancel');
        cancelBtn.click(function() {
            $('.popup-wrapper').fadeOut();
            console.log("Cancel")
        })
    }

    function openSubscribeModalWindow(modalWindowType) {
        if (modalWindowType !== 'subscribe') {
            return;
        } else {
            setTimeout(() => {
                if ($('.delete__popup-wrapper')[0].style.display !== 'block') {
                    $('.subscribe__popup-wrapper').fadeIn();
                }
            }, 10000)
        }
    }

    function createDeleteModalWindow(message, messageType, overflowBackground = 'black') {
        const modalWindowWrapper = $('<div class="delete__popup-wrapper popup-wrapper"></div>')
            .append(`<div class="popup_flexBox">
                <div class="delete__popup popup">
                    <div class="popup__content">
                        <div class="popup__question">
                            <p class="popup__close__btn">&times;</p>
                            <p class="popup__text">${message}</p>
                        </div>
                        <div class="popup__buttons__wrapper d-flex flex-column flex-sm-row justify-content-around mt-5">
                            <div class="popup__button_ok popup__button">
                                <input type="button" value="Ok">
                            </div>
                             <div class="popup__button_cancel popup__button ml-5">
                                <input type="button" value="Cancel">
                            </div>
                        </div>
                    </div>
                </div>
            </<div>`);

        $('.main-container').append(modalWindowWrapper);
        if (overflowBackground !== 'dark') {
            $('.delete__popup-wrapper').addClass('popup-wrapper-light');
        }
        if (messageType === 'error') {
            $('.delete__popup').css("border", "1px solid red")
        } else if (messageType === 'success') {
            $('.delete__popup').css("border", "1px solid green")
        } else {
            $('.delete__popup').css("border", "1px solid lightgray")
        }
    }

    function createSubscribeModalWindow(message, messageType, overflowBackground = 'dark') {
        const modalWindowWrapper = $('<div class="subscribe__popup-wrapper popup-wrapper"></div>')
            .append(`<div class="popup_flexBox">
                <div class="subscribe__popup popup">
                    <div class="popup__content">
                        <div class="popup__question">
                            <p class="popup__close__btn">&times;</p>
                            <p class="popup__text">${message}</p>
                        </div>
                        <div class="popup__buttons__wrapper d-flex flex-column flex-sm-row justify-content-around mt-5">
                            <div class="popup__button_ok popup__button">
                                <input type="button" value="Ok">
                            </div>
                             <div class="popup__button_cancel popup__button ml-5">
                                <input type="button" value="Cancel">
                            </div>
                        </div>
                    </div>
                </div>
            </<div>`);

        $('.main-container').append(modalWindowWrapper);
        if (overflowBackground !== 'dark') {
            $('.subscribe__popup-wrapper').addClass('popup-wrapper-light');
        }
        if (messageType === 'error') {
            $('.subscribe__popup').css("border", "1px solid red")
        } else if (messageType === 'success') {
            $('.subscribe__popup').css("border", "1px solid green")
        } else {
            $('.subscribe__popup').css("border", "1px solid lightgray")
        }
    }

    $.fn.openModalWindowPlugin = function(message, messageType, overflowBackground, modalWindowType) {
        if (modalWindowType === 'delete') {
            $(this).append(createDeleteModalWindow(message, messageType, overflowBackground));
            openDeleteModalWindow(modalWindowType);
        } else {
            $(this).append(createSubscribeModalWindow(message, messageType, overflowBackground));
            openSubscribeModalWindow(modalWindowType);
        }
    }
})(jQuery)