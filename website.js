

const slider = document.querySelector('.slider');
        const items = document.querySelectorAll('.slider .item');
        const toggleBtn = document.getElementById('toggle-btn');
        const imageText = document.getElementById('image-text');
        const textTitle = document.getElementById('text-title');
        const textDescription = document.getElementById('text-description');

        const total = items.length;
        const anglePerItem = 360 / total;

        let isPlaying = true;
        let currentRotation = 0;
        let isAnimating = false;
        let activeItemIndex = -1;

        // Function to get approximate current rotation during animation
        function getCurrentRotationApprox() {
            if (isPlaying) {
                // Estimate based on animation time and speed
                const animationDuration = 20000; // 20 seconds
                const startTime = performance.now() - (performance.now() % animationDuration);
                const elapsed = performance.now() - startTime;
                const progress = (elapsed / animationDuration) % 1;
                return progress * 360;
            }
            return currentRotation;
        }

        // Function to normalize angle to 0-360 range
        function normalizeAngle(angle) {
            return ((angle % 360) + 360) % 360;
        }

        // Function to find shortest rotation path
        function getShortestRotation(from, to) {
            const diff = normalizeAngle(to - from);
            if (diff > 180) {
                return from - (360 - diff);
            } else {
                return from + diff;
            }
        }

        // Function to show text
        function showText(title, description) {
            if (textTitle && textDescription && imageText) { // Null check
                textTitle.textContent = title;
                textDescription.textContent = description;
                setTimeout(() => {
                    imageText.classList.add('show');
                }, 800); // Show text after rotation completes
            }
        }

        // Function to hide text
        function hideText() {
            if (imageText) { // Null check
                imageText.classList.remove('show');
            }
        }

        // Function to set active item
        function setActiveItem(index) {
            // Remove active class from all items
            items.forEach(item => item.classList.remove('active'));
            
            // Add active class to current item
            if (index >= 0 && index < items.length) {
                items[index].classList.add('active');
                activeItemIndex = index;
            } else {
                activeItemIndex = -1;
            }
        }

        // Pause/Play toggle
        if (toggleBtn && slider) { // Null check
            toggleBtn.addEventListener('click', () => {
                if (isAnimating) return; // Don't allow toggle during click animation

                if (isPlaying) {
                    currentRotation = getCurrentRotationApprox();
                    slider.style.animation = 'none';
                    slider.style.transform = `perspective(1000px) rotateX(-10deg) rotateY(${currentRotation}deg)`;
                    toggleBtn.textContent = 'Play';
                } else {
                    // Hide text and remove active state when resuming
                    hideText();
                    setActiveItem(-1);
                    // Resume animation from current position
                    slider.style.animation = `spin 20s linear infinite`;
                    slider.style.animationDelay = `-${(currentRotation / 360) * 20}s`;
                    toggleBtn.textContent = 'Pause';
                }
                isPlaying = !isPlaying;
            });
        }

        // Rotate selected image to front on click with smooth animation
        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (isAnimating) return; // Prevent multiple clicks during animation
                if (!slider) return; // Null check for slider

                isAnimating = true;

                // Hide any existing text
                hideText();

                // Pause the animation and get current position
                if (isPlaying) {
                    currentRotation = getCurrentRotationApprox();
                    isPlaying = false;
                    slider.style.animation = 'none';
                    slider.style.transform = `perspective(1000px) rotateX(-10deg) rotateY(${currentRotation}deg)`;
                    if (toggleBtn) toggleBtn.textContent = 'Play';
                }

                
                setTimeout(() => {
                    const targetAngle = -index * anglePerItem;
                    const shortestAngle = getShortestRotation(currentRotation, targetAngle);

                    slider.style.transform = `perspective(1000px) rotateX(-10deg) rotateY(${shortestAngle}deg)`;
                    currentRotation = normalizeAngle(shortestAngle);
                    setActiveItem(index);

                    const title = item.getAttribute('data-title');
                    const description = item.getAttribute('data-description');
                    showText(title, description);

                    setTimeout(() => {
                        isAnimating = false;
                    }, 800); 
                }, 50);
            });
        });

  // ----------------dj9  -----------------------
  // Corrected and robust navbar visibility logic:
  const bottomNavBarElement = document.getElementById('bottomFixedNavbarElement');
  const topScrollTrackingElement = document.getElementById('hiddeElement');

  function handleBottomNavbarVisibility() {
      if (!topScrollTrackingElement) {
          return; 
      }
      if (!bottomNavBarElement) {
          return;
      }

      const topSectionRect = topScrollTrackingElement.getBoundingClientRect();

      if (topSectionRect.bottom < 0) {
          bottomNavBarElement.classList.add('show');
      } else {
          bottomNavBarElement.classList.remove('show');
      }
  }

  window.addEventListener('scroll', handleBottomNavbarVisibility);

  try {
      handleBottomNavbarVisibility();
  } catch (e) {
      console.error("Error during initial call to handleBottomNavbarVisibility:", e);
  }

 // --------------------------------- new sec (Testimonial Scroll Logic) -------------------------------
  gsap.registerPlugin(ScrollTrigger);

// Ensure the DOM is ready
document.addEventListener('DOMContentLoaded', () => {

    const testimonialMain = document.querySelector('.testimonial-main');
    const testimonialGrid = document.querySelector('.testimonial-grid');
    const cards = gsap.utils.toArray(testimonialGrid ? testimonialGrid.children : []); // Get direct children

    if (testimonialMain && testimonialGrid && cards.length) {
        const viewingContainer = document.querySelector('.testimonial-container');
        if (!viewingContainer) {
            console.error("GSAP ScrollTrigger: .testimonial-container not found for width calculations. Using .testimonial-main as fallback.");
        }

        const viewportWidth = viewingContainer ? viewingContainer.offsetWidth : testimonialMain.offsetWidth;
        let scrollDistance = testimonialGrid.offsetWidth - viewportWidth;
        scrollDistance = Math.max(0, scrollDistance);

        gsap.to(testimonialGrid, {
            x: () => -scrollDistance,
            ease: "none",
            scrollTrigger: {
                trigger: testimonialMain,
                start: "top top",
                end: () => "+=" + (scrollDistance),
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                // markers: true,
            }
        });

        cards.forEach((card, index) => {
            gsap.set(card, { autoAlpha: 0, scale: 0.7 });

            ScrollTrigger.create({
                trigger: card,
                containerAnimation: gsap.getTweensOf(testimonialGrid)[0],
                start: "left center",
                end: "right center",
                // markers: {startColor: "darkblue", endColor: "crimson", indent: (index * 40)},
                onToggle: (self) => {
                    if (self.isActive) {
                        gsap.to(card, { autoAlpha: 1, scale: 1, duration: 0.15, ease: "power1.inOut" }); // Faster
                    } else {
                        gsap.to(card, { autoAlpha: 0, scale: 0.7, duration: 0.15, ease: "power1.inOut" }); // Faster
                    }
                },
            });
        });

        if (cards.length > 0) {
            gsap.delayedCall(0.1, () => {
                let closestCard = null;
                let smallestDistance = Infinity;

                const vcForCoords = viewingContainer || testimonialMain;
                if (!vcForCoords) return;

                const viewportCenterX = vcForCoords.offsetWidth / 2;
                const vcRectLeft = vcForCoords.getBoundingClientRect().left;

                cards.forEach(card => {
                    const cardRect = card.getBoundingClientRect();
                    const cardCenterX = (cardRect.left - vcRectLeft) + (cardRect.width / 2);
                    const distance = Math.abs(viewportCenterX - cardCenterX);

                    if (distance < smallestDistance) {
                        smallestDistance = distance;
                        closestCard = card;
                    }
                });

                if (closestCard) {
                    gsap.to(closestCard, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power1.out", overwrite: "auto" }); // Faster
                } else if (scrollDistance === 0) {
                     gsap.to(cards[0], { autoAlpha: 1, scale: 1, duration: 0.2, overwrite: "auto" }); // Faster
                }
            });
        }

    } else {
        console.error("GSAP ScrollTrigger: Crucial elements for testimonial scroll not found for setup.");
        if (!testimonialMain) console.error("Element .testimonial-main not found.");
        if (!testimonialGrid) console.error("Element .testimonial-grid not found.");
        if (!cards.length) console.error("No direct children cards found in .testimonial-grid.");
    }
});




//---------------- card -------------------

//------------------ card -------------------