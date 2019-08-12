document.addEventListener('scroll', _ => {
  var docElem = document.documentElement;
  var docBody = document.body;
  var docScrollTop = (docBody.scrollTop || docElem.scrollTop);
  var docScrollHeight = (docBody.scrollHeight || docElem.clientHeight);

  readPercent = docScrollTop / (docScrollHeight - docElem.clientHeight) * 100;

  if (readPercent > 0) {
    progressBar = document.querySelector('.progress');
    progressBar.style.setProperty('--scroll', readPercent + '%');
  } else {
    progressBar.style.setProperty('--scroll', '0%');
  }
})