// update values from JSON

var request = new XMLHttpRequest(),
	url = 'https://coop-mock-test-api.herokuapp.com/',
	raised = document.querySelector('#raised'),
	target = document.querySelector('#target'),
	progress = document.querySelector('#progress'),
	figures = document.querySelector('#figures'),
	raisedTotal = 0,
	raisedTarget = 0,
	progressPercentage = 0;

var updateProgress = function() {
	
	// update total raised
	raised.innerText = raisedTotal.toLocaleString('en', {minimumFractionDigits: 2});

	// update progress
    progressPercentage = (raisedTotal/raisedTarget)*100;
	progress.value = progressPercentage;

}

request.open('GET', url, true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    // Success!
    
    // get data
    var data = JSON.parse(request.responseText);
    
    
    // update totals

    raisedTotal = data.raised;
    raisedTarget = data.target;

    target.innerText = raisedTarget.toLocaleString('en');

    updateProgress();


    // show dynamic figures
    progress.classList.add('show');
    figures.classList.add('show');

  } else {
    // We reached our target server, but it returned an error
    console.log('error')
  }
};

request.onerror = function() {
  // There was a connection error of some sort
  alert(' There was an error... do something')
};

// make request
request.send();

// submit form

var form = document.getElementById('frm-donate'),
	input = document.getElementById('frm-donate__donation');

var success = document.createElement('p'),
	successText = form.getAttribute('data-success'),
	donateText = form.getAttribute('data-donate');

success.classList.add('success');
success.id = 'success';

if(form.addEventListener){
    form.addEventListener('submit', function(e){
		e.preventDefault();

		var val = Number(input.value);

		if(val > 0) {

			raisedTotal = raisedTotal + val;

			raised.innerText = raisedTotal.toLocaleString('en', {minimumFractionDigits: 2});

		    // update progress
	    	updateProgress();

	    	if (progressPercentage >= 100) {	
	    		figures.classList.add('achieved');

	    		success.innerHTML = successText;

	    	} else {

	    		success.innerHTML = donateText;

	    	}
	    	
	    	if(!document.getElementById('success')) {
	    		success.appendAfter(figures);
	    	}

	    	input.value = '';

	    	console.log('submit form')

	    }

	});

	Element.prototype.appendAfter = function (element) {
		element.parentNode.insertBefore(this, element.nextSibling);
	},false;

}