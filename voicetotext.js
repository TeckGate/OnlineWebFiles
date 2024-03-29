﻿/*!
 * Original Credits of version v1.0.0:
 *
 * NOTE: voice-text-tool.blogspot.com is not original developer of script.
 * If your are developer this script v1.0.0 then please message/contact us for proper credits. We will be happy to give proper credits.
 */
 
/*!
 * Updated Script!
 * Voice to Text Note Maker v2.1.0

 * voice-text-tool.blogspot.com
 * Released under the Creative Commons Attribution-ShareAlike 3.0 Unported License.
 * Use with proper credits.
 */

var langs = [
		
		['English', ['en-AU', 'Australia'],
					['en-CA', 'Canada'],
					['en-IN', 'India'],
					['en-NZ', 'New Zealand'],
					['en-ZA', 'South Africa'],
					['en-GB', 'United Kingdom'],
					['en-US', 'United States'],
		],
		['Arabic', ['ar-001', 'World'],
					['ar-SY', 'Syria'],
					['ar-TN', 'Tunisia'],
					['ar-AE', 'United Arab Emirates'],
					['ar-YE', 'Yemen'],
					['ar-DZ', 'Algeria'],
					['ar-MA', 'Morocco'],
					
		],
		['France', ['fr-FR', 'France']],
		['Spanish', ['es-ES', 'Spain'],
					['gl-ES', 'Galician'],
					['en-ES', 'English'],
					['ca-ES', 'Catalan'],
					['eu-ES', 'Basque'],
					['ast-ES', 'Asturian'],
					
		],
	['Chinese', ['zh-CN', 'China mainland']],
	['Japanese', ['ja-JP', 'Japan']],
	['Germany', ['de-DE', 'German']],
		['Hindi',	['hi-IN']],
		
		
	];
	for (var i = 0; i < langs.length; i++) {
	  select_language.options[i] = new Option(langs[i][0], i);
	}
	select_language.selectedIndex = 0;
	updateCountry();
	select_dialect.selectedIndex = 0;
	showInfo('info_start');

	function updateCountry() {
	  for (var i = select_dialect.options.length - 1; i >= 0; i--) {
		select_dialect.remove(i);
	  }
	  var list = langs[select_language.selectedIndex];
	  for (var i = 1; i < list.length; i++) {
		select_dialect.options.add(new Option(list[i][1], list[i][0]));
	  }
	  select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
	}

	var create_email = false;
	var final_transcript = '';
	var recognizing = false;
	var ignore_onend;
	var start_timestamp;
	if (!('webkitSpeechRecognition' in window)) {
	  upgrade();
	} else {
	  start_button.style.display = 'inline-block';
	  var recognition = new webkitSpeechRecognition();
	  recognition.continuous = true;
	  recognition.interimResults = true;

	  recognition.onstart = function() {
		recognizing = true;
		showInfo('info_speak_now');
		start_img.src = 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic-animate.gif';
	  };

	  recognition.onerror = function(event) {
		if (event.error == 'no-speech') {
		  start_img.src = 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif';
		  showInfo('info_no_speech');
		  ignore_onend = true;
		}
		if (event.error == 'audio-capture') {
		  start_img.src = 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif';
		  showInfo('info_no_microphone');
		  ignore_onend = true;
		}
		if (event.error == 'not-allowed') {
		  if (event.timeStamp - start_timestamp < 100) {
			showInfo('info_blocked');
		  } else {
			showInfo('info_denied');
		  }
		  ignore_onend = true;
		}
	  };

	  recognition.onend = function() {
		recognizing = false;
		if (ignore_onend) {
		  return;
		}
		start_img.src = 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif';
		if (!final_transcript) {
		  showInfo('info_start');
		  return;
		}
		showInfo('');
		if (window.getSelection) {
		  window.getSelection().removeAllRanges();
		  var range = document.createRange();
		  range.selectNode(document.getElementById('final_span'));
		  window.getSelection().addRange(range);
		}
		if (create_email) {
		  create_email = false;
		  createEmail();
		}
	  };

	  recognition.onresult = function(event) {
		var interim_transcript = '';
		if (typeof(event.results) == 'undefined') {
		  recognition.onend = null;
		  recognition.stop();
		  upgrade();
		  return;
		}
		for (var i = event.resultIndex; i < event.results.length; ++i) {
		  if (event.results[i].isFinal) {
			final_transcript += event.results[i][0].transcript;
		  } else {
			interim_transcript += event.results[i][0].transcript;
		  }
		}
		final_transcript = capitalize(final_transcript);
		final_span.innerHTML = linebreak(final_transcript);
		interim_span.innerHTML = linebreak(interim_transcript);
		if (final_transcript || interim_transcript) {
		  showButtons('inline-block');
		}
	  };

	  recognition.onresult = function(event) {
		var interim_transcript = '';
		if (typeof(event.results) == 'undefined') {
		  recognition.onend = null;
		  recognition.stop();
		  upgrade();
		  return;
		}
		for (var i = event.resultIndex; i < event.results.length; ++i) {
		  if (event.results[i].isFinal) {
			final_transcript += event.results[i][0].transcript;
		  } else {
			interim_transcript += event.results[i][0].transcript;
		  }
		}
		final_transcript = capitalize(final_transcript);
		final_span.innerHTML = linebreak(final_transcript);
		interim_span.innerHTML = linebreak(interim_transcript);
		if (final_transcript || interim_transcript) {
		  showButtons('inline-block');
		}
	  };
	  
	}

	function upgrade() {
	  start_button.style.visibility = 'hidden';
	  showInfo('info_upgrade');
	}

	var two_line = /\n\n/g;
	var one_line = /\n/g;
	function linebreak(s) {
	  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
	}

	var first_char = /\S/;
	function capitalize(s) {
	  return s.replace(first_char, function(m) { return m.toUpperCase(); });
	}

	function createEmail() {
	  var n = final_transcript.indexOf('\n');
	  if (n < 0 || n >= 80) {
		n = 40 + final_transcript.substring(40).indexOf(' ');
	  }
	  var subject = encodeURI(final_transcript.substring(0, n));
	  var body = encodeURI(final_transcript.substring(n + 1));
	  window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
	}

	function copyButton() {
	  if (recognizing) {
		recognizing = false;
		recognition.stop();
	  }
	  copy_button.style.display = 'none';
	  copy_info.style.display = 'inline-block';
	  showInfo('');
	}

	function emailButton() {
	  if (recognizing) {
		create_email = true;
		recognizing = false;
		recognition.stop();
	  } else {
		createEmail();
	  }
	  email_button.style.display = 'none';
	  email_info.style.display = 'inline-block';
	  showInfo('');
	}

	function startButton(event) {
	  if (recognizing) {
		recognition.stop();
		return;
	  }
	  final_transcript = '';
	  recognition.lang = select_dialect.value;
	  recognition.start();
	  ignore_onend = false;
	  final_span.innerHTML = '';
	  interim_span.innerHTML = '';
	  start_img.src = 'https://www.google.com/intl/en/chrome/assets/common/images/content/mic-slash.gif';
	  showInfo('info_allow');
	  showButtons('none');
	  start_timestamp = event.timeStamp;
	}

	function showInfo(s) {
	  if (s) {
		for (var child = info.firstChild; child; child = child.nextSibling) {
		  if (child.style) {
			child.style.display = child.id == s ? 'inline' : 'none';
		  }
		}
		info.style.visibility = 'visible';
	  } else {
		info.style.visibility = 'hidden';
	  }
	}

	var current_style;
	function showButtons(style) {
	  if (style == current_style) {
		return;
	  }
	  current_style = style;
	  copy_button.style.display = style;
	  email_button.style.display = style;
	  copy_info.style.display = 'none';
	  email_info.style.display = 'none';
	}

	function saveTextAsUnicode() {
    var textToSave = document.getElementById("results").value;
    var textToSaveAsBlob = new Blob([textToSave], {type:"text/Doc"});
	//var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
	//var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;
    var fileNameToSaveAs = "Text in Unicode.doc";
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}

function CopyToClipboard(results) {
if (document.selection) { 
    var range = document.body.createTextRange();
    range.moveToElementText(document.getElementById(results));
    range.select().createTextRange();
    document.execCommand("copy"); 

} else if (window.getSelection) {
    var range = document.createRange();
     range.selectNode(document.getElementById(results));
     window.getSelection().addRange(range);
     document.execCommand("copy");
//     alert("Text Copied,") 
}

     btn = document.getElementById("button1");
     btn.value = 'Selected Text Copied!';
	 setInterval(function(){ btn.value = 'Copy!'; }, 2000);
}
