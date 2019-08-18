document.addEventListener('scroll', _ => {
  var docElem = document.documentElement;
  var docBody = document.body;
  var docScrollTop = (docBody.scrollTop || docElem.scrollTop);

  readPercent = docScrollTop / (docElem.scrollHeight - docElem.clientHeight) * 100;

  if (readPercent > 0) {
    progressBar = document.querySelector('#progress-bar');
    progressBar.style.setProperty('--scroll', readPercent + '%');
  } else {
    progressBar.style.setProperty('--scroll', '0%');
  }
})