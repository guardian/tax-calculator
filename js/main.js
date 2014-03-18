$(function() {

  'use strict';

  var taxationSystemFormer = [
    {'name': 'PersonalAllowance', 'taxThreshold': 10000, 'pc': 0},
    {'name': 'BasicRate', 'taxThreshold': 20000, 'pc': 0.25},
    {'name': 'HigherRate', 'taxThreshold': 40000, 'pc': 0.4},
    {'name': 'AdditonalRate', 'taxThreshold': 150000, 'pc': 0.5}
  ];

  var taxationSystemCurrent = [
    {'name': 'NewPersonalAllowance', 'taxThreshold': 10000, 'pc':0},
    {'name': 'NewBasicRate', 'taxThreshold':39000, 'pc':0.25},
    {'name': 'NewHigherRate', 'taxThreshold':47000, 'pc':0.4},
    {'name': 'NewAdditonalRate', 'taxThreshold':160000, 'pc':0.5}
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

    // $('.verdict p:first').html(taxationChangeString);
  });

  function calculateTaxation(yearlySalary, taxationSystem){
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

    console.log(taxableSalary);

    if (taxableSalary - taxationSystem[3]['taxThreshold'] > 0) {
      console.log('tax needs to be payed at top rate');
      taxLiability += ((taxableSalary - taxationSystem[3]['taxThreshold']) * taxationSystem[3]['pc']);
      taxableSalary = taxationSystem[3]['taxThreshold'];
      console.log('FIRST: tax liability: ' + taxLiability);
    }

    if ((taxableSalary - taxationSystem[2]['taxThreshold']) >= 0) {
      console.log('TAX NEEDED AT MIDDLE RATE');
      taxableSalary = (taxableSalary - taxationSystem[2]['taxThreshold']);
      taxLiability += (taxableSalary * taxationSystem[2]['pc']);
      console.log('SECOND: ' + taxLiability);
    }

    taxLiability += taxationSystem[1]['taxThreshold'] * taxationSystem[1]['pc'];

    console.log('FINAL tax liability is ' + taxLiability);

    return taxLiability;
  }

});