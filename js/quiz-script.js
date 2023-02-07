$(document).ready(function() {
    const quizHandler = {
        setStep: (step) => {
            $('.quiz__step').removeClass('active');
            $(`.quiz__step[data-step="${step}"]`).addClass('active');
        },
        setGift: (name, image) => {
            $('.js-gift-name').text(name);
            $('.js-gift-image').attr('src', image);
        },
        setPlace: (image) => {
            $('.js-place-image').attr('src', image);
        },
    };

    $('.js-quiz-next-step').on('click', function() {
        const currentStep = +$(this).closest('.quiz__step').attr('data-step');
        let error = false;

        if ($(`.quiz__step[data-step="${currentStep}"] .quiz__radio__item`).length && $(`.quiz__step[data-step="${currentStep}"] .quiz__radio__item.active`).length == 0) {
            error = true;
        }

        if ($(`.quiz__step[data-step="${currentStep}"] .quiz__checkbox__item`).length && $(`.quiz__step[data-step="${currentStep}"] .quiz__checkbox__item.active`).length == 0) {
            error = true;
        }

        if (!error) {
            quizHandler.setStep(currentStep + 1);
        } else {
            $(`.quiz__step[data-step="${currentStep}"] .quiz__title`).addClass('error');
        }
    });

    $('.js-quiz-prev-step').on('click', function() {
        const currentStep = +$(this).closest('.quiz__step').attr('data-step');
        quizHandler.setStep(currentStep - 1);
    });

    $('.quiz__radio__item').on('click', function() {
        $(this).siblings('.quiz__radio__item').removeClass('active');
        $(this).addClass('active');
        $('#quiz').find('.quiz__title').removeClass('error');
    });

    $('.quiz__checkbox__item').on('click', function() {
        $(this).siblings('.quiz__checkbox__item').removeClass('active');
        $(this).addClass('active');
        $('#quiz').find('.quiz__title').removeClass('error');
    });

    $(".custom-range__input").each(function() {
        $this = $(this);
        let value = Number($(this).attr('data-value'));
        let min = Number($(this).attr('data-min'));
        let max = Number($(this).attr('data-max'));
        $(this).slider({
            range: "min",
            animate: "fast",
            value: value,
            min: min,
            max: max,
            create: function(event, ui) {
                $(this).find('span').attr('data-value', value);
            },
            slide: function(event, ui) {
                $(this).find('span').attr('data-value', ui.value);
            }
        });
    });

    $('.custom-iterator button').on('click', function() {
        let currentValue = +$(this).siblings('input').val();
        let newValue = ($(this).attr('data-action') == 'plus') ? (currentValue + 1) : (currentValue - 1);
        if (newValue <= 0) {
            newValue = 1;
        }
        $(this).siblings('input').val(newValue);
    });

    let fields = document.querySelectorAll('.field__file');
    Array.prototype.forEach.call(fields, function (input) {
        let label = input.nextElementSibling;
        let labelVal = label.querySelector('.field__file-fake').innerText;

        input.addEventListener('change', function (e) {
            if (this.files[0].name)
                label.querySelector('.field__file-fake').innerText = this.files[0].name;
            else
                label.querySelector('.field__file-fake').innerText = labelVal;
        });
    });

    // phone input mask
    $("input[type='tel']").mask("+9 (999) 999-99-99");
    $("input[type='tel']").keyup(function () {
        var $input = $(this);
        if ($input.val() == "+8") {
            $input.val("+7");
        }
        if ($input.val() == "+9") {
            $input.val("+7 (9");
        }
    });

    $('#quiz button').on('click', function(e) {
        e.preventDefault();
    });

    document.getElementById('quiz-form').onsubmit = async (e) => {
        e.preventDefault();

        let error = false;

        // validate phone
        if ($('.quiz__step[data-step="8"] input[name="quiz_phone"]').val() == "") {
            $('.quiz__step[data-step="8"] input[name="quiz_phone"]').addClass('error');
            error = true;
        }

        // validate policy
        if (!$('.quiz__step[data-step="8"] input#quiz__policy__input').is(':checked')) {
            $('.quiz__step[data-step="8"] .quiz__policy').addClass('error');
            error = true;
        }

        if (!error) {
            var formData = new FormData(document.getElementById('quiz-form'));

            formData.append($('.quiz__step[data-step="1"] .quiz__title').text(), $('.quiz__step[data-step="1"] .quiz__radio__item.active .quiz__radio__name').text());
            formData.append($('.quiz__step[data-step="2"] .quiz__title').text() + " (Площадь объекта:)", $('.quiz__step[data-step="2"] .custom-range__input .ui-slider-handle').attr('data-value'));
            formData.append($('.quiz__step[data-step="2"] .quiz__title').text() + " (Количество комнат:)", $('.quiz__step[data-step="2"] input[name="quiz_room"]').val());
            formData.append($('.quiz__step[data-step="3"] .quiz__title').text(), $('.quiz__step[data-step="3"] .quiz__radio__item.active .quiz__radio__name').text());
            formData.append($('.quiz__step[data-step="4"] .quiz__title').text(), $('.quiz__step[data-step="4"] .quiz__checkbox__item.active').text());
            formData.append($('.quiz__step[data-step="5"] .quiz__title').text(), $('.quiz__step[data-step="5"] .quiz__checkbox__item.active').text());
            formData.append($('.quiz__step[data-step="6"] .quiz__title').text(), $('.quiz__step[data-step="6"] .quiz__checkbox__item.active').text());
            formData.append($('.quiz__step[data-step="7"] .quiz__title').text(), $('.quiz__step[data-step="7"] .quiz__radio__item.active .quiz__radio__name').text());
            formData.append('Номер телефона', $('.quiz__step[data-step="8"] input[name="quiz_phone"]').val());

            formData.delete('quiz_phone');
            formData.delete('quiz_room');

            let response = await fetch('/send.php', {
                method: 'POST',
                body: formData
            });
    
            if (response.ok) {
                $('.quiz__finish').hide('100');
                $('.quiz__policy').hide('100');
                $('.quiz__success').show('100');
            } else {
                console.log("Ошибка HTTP: " + response.status);
            }
        }
    };

    $('.quiz__step[data-step="8"] input[name="quiz_phone"]').on('click', function() {
        $(this).removeClass('error');
    });

    $('.quiz__step[data-step="8"] .quiz__policy').on('click', function() {
        $(this).removeClass('error');
    });

    $('.js-quiz-set-gift').on('click', function() {
        const giftName = $('.quiz__step[data-step="7"] .quiz__radio__item.active .quiz__radio__name').text();
        const giftImage = $('.quiz__step[data-step="7"] .quiz__radio__item.active img').attr('src');
        quizHandler.setGift(giftName, giftImage);
    });

    $('.js-set-place').on('click', function() {
        const giftImage = $('.quiz__step[data-step="1"] .quiz__radio__item.active img').attr('src');
        quizHandler.setPlace(giftImage);
    });
});