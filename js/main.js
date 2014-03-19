$(function() {

  'use strict';

  var taxationSystemFormer = [
    {'name': 'PersonalAllowance', 'taxThreshold': 10000, 'pc': 0},
    {'name': 'BasicRate', 'taxThreshold': 31865, 'pc': 0.20},
    {'name': 'HigherRate', 'taxThreshold': 108135, 'pc': 0.40},
    {'name': 'AdditonalRate', 'taxThreshold': 10000000, 'pc': 0.45}
  ];

  var taxationSystemCurrent = [
    {'name': 'NewPersonalAllowance', 'taxThreshold': 10500, 'pc':0},
    {'name': 'NewBasicRate', 'taxThreshold': 31785, 'pc':0.20},
    {'name': 'NewHigherRate', 'taxThreshold':107715, 'pc':0.40},
    {'name': 'NewAdditonalRate', 'taxThreshold':10000000, 'pc':0.45}
  ];

  $('.salary').autoNumeric('init', {'aSep': ',', 'aSign': '£', 'vMin': '0'});

  $(document).keypress(function(e) {
      if (e.which === 13) {
        $('.submit').trigger('click');
      }
  });

  $('.submit').click(function(e) {
    e.preventDefault();
    var yearlySalary = parseInt($('.salary').autoNumeric('get'), 10);
    var oldAmount = calculateTaxation(yearlySalary, taxationSystemFormer);
    var newAmount = calculateTaxation(yearlySalary, taxationSystemCurrent);
    var taxationChangeString;

    $('.verdict p:first').html('Est. tax 14/15: £' + oldAmount);
    $('.verdict p:last').html('Est. tax 15/16: £' + newAmount);

    if (oldAmount > newAmount)
       taxationChangeString = ('£' + (oldAmount - newAmount)) + ' better off';
    if (oldAmount < newAmount)
       taxationChangeString = ('£' + (newAmount - oldAmount)) + ' worse off';
    if (oldAmount === newAmount)
      taxationChangeString = 'No change';

  });

  function calculateTaxation(yearlySalary, taxationSystem) {
    var taxableSalary;
    var taxLiability = 0;

    if (yearlySalary < 1e5) {
      taxableSalary = yearlySalary - taxationSystem[0]['taxThreshold'];
    } else {
      var adjustedPersonalAllowance = taxationSystem[0]['taxThreshold'] - ((yearlySalary - 1e5) / 2);
      if (adjustedPersonalAllowance < 0) {
        taxableSalary = yearlySalary - taxationSystem[0]['taxThreshold'];
      } else {
        taxableSalary = yearlySalary - adjustedPersonalAllowance;
      }
    }

    var firstBandTaxLiability = 0;
    var secondBandTaxLiability = 0;
    var thirdBandTaxLiability = 0;
    var fourthBandTaxLiability = 0;

    // CALCULATE SECOND BAND LIABILITY
    if (taxableSalary > 0) {
      if (taxableSalary > taxationSystem[1]['taxThreshold']) {
        secondBandTaxLiability = (taxationSystem[1]['taxThreshold']) * taxationSystem[1]['pc'];
      } else {
        secondBandTaxLiability = taxableSalary * taxationSystem[1]['pc'];
      }
    }

    // CALCULATE THIRD BAND LIABILITY
    if (taxableSalary > taxationSystem[1]['taxThreshold']) {
      if (taxableSalary > taxationSystem[3]['taxThreshold']) {
        thirdBandTaxLiability = (taxationSystem[2]['taxThreshold']) * taxationSystem[2]['pc'];
      } else {
        thirdBandTaxLiability = (taxableSalary - taxationSystem[1]['taxThreshold']) * taxationSystem[2]['pc'];
      }
    }

    // CALCULATE FOURTH BAND LIABILITY
    if (taxableSalary > taxationSystem[3]['taxThreshold']) {
      fourthBandTaxLiability = (taxableSalary - taxationSystem[3]['taxThreshold']) * taxationSystem[3]['pc'];
    }

    // console.log('FIRST BAND LIABILITY: ' + firstBandTaxLiability);
    // console.log('SECOND BAND LIABILITY: ' + secondBandTaxLiability);
    // console.log('THIRD BAND LIABILITY: ' + thirdBandTaxLiability);
    // console.log('FOURTH BAND LIABILITY: ' + fourthBandTaxLiability);

    taxLiability = firstBandTaxLiability + secondBandTaxLiability + thirdBandTaxLiability + fourthBandTaxLiability;

    return taxLiability;
  }

});