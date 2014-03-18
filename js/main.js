$(function() {

  'use strict';

  var taxationSystemFormer = [
    {'name': 'PersonalAllowance', 'taxThreshold': 10000, 'pc': 0},
    {'name': 'BasicRate', 'taxThreshold': 30000, 'pc': 0.25},
    {'name': 'HigherRate', 'taxThreshold': 40000, 'pc': 0.4},
    {'name': 'AdditonalRate', 'taxThreshold': 150000, 'pc': 0.5}
  ];

  var taxationSystemCurrent = [
    {'name': 'NewPersonalAllowance', 'taxThreshold': 10000, 'pc':0},
    {'name': 'NewBasicRate', 'taxThreshold':30000, 'pc':0.25},
    {'name': 'NewHigherRate', 'taxThreshold':40000, 'pc':0.4},
    {'name': 'NewAdditonalRate', 'taxThreshold':150000, 'pc':0.5}
  ];

  $('.salary').autoNumeric('init', {'aSep': ',', 'aSign': '£', 'vMin': '0'});

  $('.submit').click(function(e) {
    e.preventDefault();
    var yearlySalary = parseInt($('.salary').autoNumeric('get'), 10);
    var oldAmount = calculateTaxation(yearlySalary, taxationSystemFormer);
    var newAmount = calculateTaxation(yearlySalary, taxationSystemCurrent);
    var taxationChangeString;

    $('.verdict p:first').html('Tax last year: £' + oldAmount);
    $('.verdict p:last').html('Tax this year: £' + newAmount);

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
    if (taxableSalary > taxationSystem[0]['taxThreshold']) {

      if (taxableSalary > taxationSystem[1]['taxThreshold']) {
        secondBandTaxLiability = (taxationSystem[1]['taxThreshold']) * taxationSystem[1]['pc'];
      } else {
        secondBandTaxLiability = taxableSalary * taxationSystem[1]['pc'];
      }

    }

    // CALCULATE THIRD BAND LIABILITY
    if (taxableSalary > taxationSystem[2]['taxThreshold']) {

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

    console.log('FIRST BAND LIABILITY: ' + firstBandTaxLiability);
    console.log('SECOND BAND LIABILITY: ' + secondBandTaxLiability);
    console.log('THIRD BAND LIABILITY: ' + thirdBandTaxLiability);
    console.log('FOURTH BAND LIABILITY: ' + fourthBandTaxLiability);

    taxLiability = firstBandTaxLiability + secondBandTaxLiability + thirdBandTaxLiability + fourthBandTaxLiability;

    return taxLiability;
  }

});