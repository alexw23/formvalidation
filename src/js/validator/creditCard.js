/**
 * creditCard validator
 *
 * @link        http://formvalidation.io/validators/creditCard/
 * @author      https://twitter.com/nghuuphuoc
 * @copyright   (c) 2013 - 2015 Nguyen Huu Phuoc
 * @license     http://formvalidation.io/license/
 */
(function($) {
    FormValidation.I18n = $.extend(true, FormValidation.I18n || {}, {
        'en_US': {
            creditCard: {
                'default': 'Please enter a valid credit card number',
                'unsupported': 'The card number entered matches an unsupported card type: %s',
            }
        }
    });
    
    FormValidation.Validator.creditCard = {
        html5Attributes: {
            supportedcards: 'supportedCards'
        },

        /**
         * Return true if the input value is valid credit card number
         * Based on https://gist.github.com/DiegoSalazar/4075533
         *
         * @param {FormValidation.Base} validator The validator plugin instance
         * @param {jQuery} $field Field element
         * @param {Object} [options] Can consist of the following key:
         * - message: The invalid message
         * @returns {Boolean|Object}
         */
        validate: function(validator, $field, options) {
            var value = validator.getFieldValue($field, 'creditCard');
            if (value === '') {
                return true;
            }

            // Accept only digits, dashes or spaces
            if (/[^0-9-\s]+/.test(value)) {
                return false;
            }
            value = value.replace(/\D/g, '');

            if (!FormValidation.Helper.luhn(value)) {
                return false;
            }

            var locale         = validator.getLocale();

            if(options.supportedCards !== undefined)
            {
                var supportedCards = options.supportedCards.split(',');
            }

            // Validate the card number based on prefix (IIN ranges) and length
            var cards = {
                AMERICAN_EXPRESS: {
                    length: [15],
                    prefix: ['34', '37'],
                    name: 'American Express'
                },
                DINERS_CLUB: {
                    length: [14],
                    prefix: ['300', '301', '302', '303', '304', '305', '36'],
                    name: 'Diners Club'
                },
                DINERS_CLUB_US: {
                    length: [16],
                    prefix: ['54', '55'],
                    name: 'Diners Club US'
                },
                DISCOVER: {
                    length: [16],
                    prefix: ['6011', '622126', '622127', '622128', '622129', '62213',
                             '62214', '62215', '62216', '62217', '62218', '62219',
                             '6222', '6223', '6224', '6225', '6226', '6227', '6228',
                             '62290', '62291', '622920', '622921', '622922', '622923',
                             '622924', '622925', '644', '645', '646', '647', '648',
                             '649', '65'],
                    name: 'Discover'
                },
                JCB: {
                    length: [16],
                    prefix: ['3528', '3529', '353', '354', '355', '356', '357', '358'],
                    name: 'JCB'
                },
                LASER: {
                    length: [16, 17, 18, 19],
                    prefix: ['6304', '6706', '6771', '6709'],
                    name: 'Laser'
                },
                MAESTRO: {
                    length: [12, 13, 14, 15, 16, 17, 18, 19],
                    prefix: ['5018', '5020', '5038', '6304', '6759', '6761', '6762', '6763', '6764', '6765', '6766'],
                    name: 'Maestro'
                },
                MASTERCARD: {
                    length: [16],
                    prefix: ['51', '52', '53', '54', '55'],
                    name: 'MasterCard'
                },
                SOLO: {
                    length: [16, 18, 19],
                    prefix: ['6334', '6767'],
                    name: 'Solo'
                },
                UNIONPAY: {
                    length: [16, 17, 18, 19],
                    prefix: ['622126', '622127', '622128', '622129', '62213', '62214',
                             '62215', '62216', '62217', '62218', '62219', '6222', '6223',
                             '6224', '6225', '6226', '6227', '6228', '62290', '62291',
                             '622920', '622921', '622922', '622923', '622924', '622925'],
                    name: 'Union Pay'
                },
                VISA: {
                    length: [16],
                    prefix: ['4'],
                    name: 'Visa'
                }
            };

            var type, i;
            for (type in cards) {
                for (i in cards[type].prefix) {
                    if (value.substr(0, cards[type].prefix[i].length) === cards[type].prefix[i]     // Check the prefix
                        && $.inArray(value.length, cards[type].length) !== -1)                      // and length
                    {
                        if(supportedCards !== undefined && $.inArray(type, supportedCards) == -1)  // Catch unsupported cards (if the field is on)
                        {
                            return {
                                valid: false,
                                message: FormValidation.Helper.format(options.message || FormValidation.I18n[locale].creditCard['unsupported'], cards[type].name),
                                type: type
                            };
                        }
                        else
                        {
                            return {
                                valid: true,
                                message: options.message || FormValidation.I18n[locale].creditCard['default'], 
                                type: type
                            };
                        }
                    }
                }
            }

            return false;
        }
    };
}(jQuery));
