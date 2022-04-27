
var btnGroupsMobile = function() {
      const mb = document.querySelector('.mb-car-btn-groups');
      const pc = document.querySelector('.pc-car-btn-groups');
      const pcCarBtnGroups = $('.wrapper-social-popup');
      if (window.innerWidth < 1200) {
          if (mb && pc) {
            pc.style.display = 'none';
            mb.style.display = 'block';
            Array.from(pcCarBtnGroups).forEach(v => {
              v.classList.remove('pc-social');
            });
          }
      } else {
          if (mb && pc) {
            pc.style.display = 'block';
            mb.style.display = 'none';
            Array.from(pcCarBtnGroups).forEach(v => {
              v.classList.add('pc-social');
            });
          }
      };
  };


  $(document).ready(function() {
    btnGroupsMobile();
  });

  $(window).on('resize', function () {
    btnGroupsMobile();
  });