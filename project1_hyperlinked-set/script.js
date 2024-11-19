$(document).ready(function() {
  // LEFT SIDE LINKS
  $('.link > a').click(function(e) {
    e.preventDefault(); // Prevent default anchor behavior

    // Get the associated nested links
    const $nestedLinks = $(this).parent().find('.nested-links');

    // Hide other open nested-links and only show the clicked one
    $('.nested-links').not($nestedLinks).hide();

    // Toggle the nested links
    $nestedLinks.toggle();

    // // Check if dayDisplay is a whole number and pause the animation
    // if (dayDisplay % 1 === 0) {
    //   pauseAnimation();
    // }

    // // Scroll to the first nested link's target section
    // const targetId = $nestedLinks.find('a').attr('href');
    // if (targetId) {
    //   $('html, body').animate({
    //     scrollTop: $(targetId).offset().top
    //   }, 300);
    // }

    // Show specific image based on the cycleDisplay and dayDisplay
    // showSpecificImage(cycleDisplay, dayDisplay);
  });

  // MOON ANIMATION SETUP
  const $images = $('.moon');
  let currentIndex = 0;
  let interval;
  let isPaused = false;

  // function showSpecificImage(cycle, day) {
  //   let index;
  //   if (cycle === 1 && day >= 1.0 && day < 1.9) index = 0;
  //   else if (cycle === 1 && day >= 15.0 && day < 15.9) index = 1;
  //   else if (cycle === 5 && day >= 15.0 && day < 15.9) index = 2;
  //   else if (cycle === 7 && day >= 15.0 && day < 15.9) index = 3;
  //   else if (cycle === 8 && day >= 15.0 && day < 15.9) index = 4;
  //   else if (cycle === 9 && day >= 9.0 && day < 9.9) index = 5;
  //   else index = currentIndex;

  //   $images.removeClass('active');
  //   $images.eq(index).addClass('active');
  // }

  function showNextImage() {
    $images.eq(currentIndex).removeClass('active');
    currentIndex = (currentIndex + 1) % $images.length;
    $images.eq(currentIndex).addClass('active');
  }

  function startAnimation() {
    interval = setInterval(showNextImage, 500);
  }

  function pauseAnimation() {
    clearInterval(interval);
    isPaused = true;
    $('#play').prop('disabled', false);
    $('#pause').prop('disabled', true);
    clearInterval(cycleInterval);
    clearInterval(dayInterval);
  }

  function playAnimation() {
    if (isPaused) {
      startAnimation();
      startCycle();
      isPaused = false;
      $('#play').prop('disabled', true);
      $('#pause').prop('disabled', false);
    }
  }

  function restartAnimation() {
    clearInterval(interval);
    $images.removeClass('active');
    currentIndex = 0;
    $images.eq(currentIndex).addClass('active');
    startAnimation();

    clearInterval(cycleInterval);
    clearInterval(dayInterval);
    cycleDisplay = 1;
    dayDisplay = 1.0;
    $('#cycleDisplay').text(cycleDisplay);
    $('#dayDisplay').text(dayDisplay);

    startCycle();
    $('#play').prop('disabled', true);
    $('#pause').prop('disabled', false);
  }

  // Start animation on page load
  startAnimation();

  // Button event handlers
  $('#pause').click(function() {
    pauseAnimation();
    $(this).css('fill', 'var(--yellow)');
    $('#play').css('fill', '');
    $('#restart').css('fill', '');
  });

  $('#play').click(function() {
    playAnimation();
    $(this).css('fill', 'var(--yellow)');
    setTimeout(() => $(this).css('fill', ''), 300);
  });

  $('#restart').click(function() {
    restartAnimation();
    $(this).css('fill', 'var(--yellow)');
    setTimeout(() => $(this).css('fill', ''), 300);
  });

  let cycleDisplay = 1;
  let dayDisplay = 1.0;
  let cycleInterval, dayInterval;

  function updateCycle() {
    cycleDisplay = (cycleDisplay % 12) + 1;
    $('#cycleDisplay').text(cycleDisplay);
    changeLinkColor(); // Update link color each cycle
  }

  function updateDay() {
    dayDisplay = (dayDisplay >= 29.5) ? 1.0 : parseFloat((dayDisplay + 0.1).toFixed(1));
    $('#dayDisplay').text(dayDisplay);
    changeLinkColor(); // Update link color each day
  }

  function startCycle() {
    cycleInterval = setInterval(updateCycle, 15000);
    dayInterval = setInterval(updateDay, 52.63157894736842);
  }

  startCycle();

  function changeLinkColor() {
    $('.link a').css('color', ''); // Reset to default
    if (cycleDisplay === 1 && dayDisplay >= 1.0 && dayDisplay < 1.9) {
      $('.link:has(a:contains("春节")) a').css('color', 'var(--yellow)');
    }
    if (cycleDisplay === 1 && dayDisplay >= 15.0 && dayDisplay < 15.9) {
      $('.link:has(a:contains("元宵节")) a').css('color', 'var(--yellow)');
    }
    if (cycleDisplay === 5 && dayDisplay >= 15.0 && dayDisplay < 15.9) {
      $('.link:has(a:contains("端午节")) a').css('color', 'var(--yellow)');
    }
    if (cycleDisplay === 7 && dayDisplay >= 15.0 && dayDisplay < 15.9) {
      $('.link:has(a:contains("七夕")) a').css('color', 'var(--yellow)');
    }
    if (cycleDisplay === 8 && dayDisplay >= 15.0 && dayDisplay < 15.9) {
      $('.link:has(a:contains("中秋节")) a').css('color', 'var(--yellow)');
    }
    if (cycleDisplay === 9 && dayDisplay >= 9.0 && dayDisplay < 9.9) {
      $('.link:has(a:contains("重阳节")) a').css('color', 'var(--yellow)');
    }
  }

  // $('.link').click(function(event) {
  //   event.preventDefault(); // Prevent default anchor behavior
  
  //   var nextPageId = $(this).attr('href'); // Get the target page ID
  //   var currentPage = $('.page:visible'); // Get the currently visible page
  //   var nextItem = $(nextPageId).index(); // Get the index of the next page
  
  //   // Set initial `clip-path` for the next page
  //   $(nextPageId).css({
  //     'z-index': parseInt(currentPage.css('z-index')) + 1,
  //     'clip-path': `inset(0 50% 0 50%)`,
  //   });
  
  //   anime({
  //     targets: $(nextPageId),
  //     update: function(anim) {
  //       // Expanding rectangle clip-path from center
  //       $(nextPageId).css('clip-path', `inset(0 ${50 - anim.progress / 2}% 0 ${50 - anim.progress / 2}%)`);
  //     },
  //     complete: function() {
  //       // Hide current page after animation and show the next page
  //       currentPage.hide(); 
  //       $(nextPageId).show(); 
  //     }
  //   });
  // });  
});