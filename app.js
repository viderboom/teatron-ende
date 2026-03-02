;(() => {
	// ===== Mobile menu (hamburger) =====
	const toggle = document.getElementById('navToggle') || document.querySelector('.nav-toggle')
	const menu = document.getElementById('mobileMenu')

	function sendWhatsapp(e) {
		e.preventDefault()
		const msg = e.target.querySelector('textarea').value.trim()
		if (!msg) return
		const url = 'https://wa.me/972584271281?text=' + encodeURIComponent(msg)
		window.open(url, '_blank')
	}
	function setYear() {
		const yearEl = document.getElementById('year')
		if (yearEl) yearEl.textContent = new Date().getFullYear()
	}

	if (toggle && menu) {
		const openMenu = () => {
			toggle.setAttribute('aria-expanded', 'true')
			menu.hidden = false
		}
		const closeMenu = () => {
			toggle.setAttribute('aria-expanded', 'false')
			menu.hidden = true
		}
		const isOpen = () => toggle.getAttribute('aria-expanded') === 'true'

		toggle.addEventListener('click', e => {
			e.stopPropagation()
			isOpen() ? closeMenu() : openMenu()
		})
		menu.addEventListener('click', e => {
			if (e.target.tagName === 'A') closeMenu()
		})
		document.addEventListener('click', e => {
			if (!isOpen()) return
			if (menu.contains(e.target) || toggle.contains(e.target)) return
			closeMenu()
		})
		document.addEventListener('keydown', e => {
			if (e.key === 'Escape' && isOpen()) closeMenu()
		})
	}

	setYear()

	// ===== Hero background slideshow =====
	const slides = document.querySelectorAll('.hero-bg__slide')
	if (slides.length > 1) {
		let current = 0
		setInterval(() => {
			slides[current].classList.remove('active')
			current = (current + 1) % slides.length
			slides[current].classList.add('active')
		}, 4500)
	}
})()

// ===== Title blocks — כל אות בריבוע צבעוני =====
;(() => {
	const COLORS = [
		'#fedb4d',
		'#f36d59',
		'#00b1b0',
		'#e42256',
		'#fedb4d',
		'#f36d59',
		'#00b1b0',
		'#e42256',
	]
	// צבע טקסט לפי רקע
	const TEXT = { '#fedb4d': '#1a1a1a', '#f36d59': '#fff', '#00b1b0': '#fff', '#e42256': '#fff' }

	// סיבובים אפשריים לתחושת אקראיות
	// const ROTATIONS = [-8, -5, -3, 0, 0, 3, 5, 8]
	// ללא סיבוב
	const ROTATIONS = [0, 0, 0, 0, 0, 0, 0, 0]

	// מיקום אנכי (top) בתוך הריבוע — אחוזים
	const TOPS = [0, 0, 0, 0, 0, 0, 0, 0]
	const LEFTS = [0, 0, 0, 0, 0, 0, 0, 0]

	document.querySelectorAll('.title-blocks').forEach(el => {
		const text = el.textContent.trim()
		el.textContent = ''

		let colorIndex = 0
		;[...text].forEach((char, i) => {
			if (char === ' ') {
				const sp = document.createElement('span')
				sp.className = 'title-blocks__space'
				el.appendChild(sp)
				return
			}

			const bg = COLORS[colorIndex % COLORS.length]
			// const fg = TEXT[bg]
			const rot = ROTATIONS[i % ROTATIONS.length]
			const top = TOPS[i % TOPS.length]
			const left = LEFTS[i % LEFTS.length]

			const box = document.createElement('span')
			box.className = 'title-blocks__letter'
			box.textContent = char
			box.style.cssText = `
        background:${bg};
        color:#fff;
        --rot:${rot}deg;
        --top:${top}%;
        --left:${left}%;
      `
			el.appendChild(box)
			colorIndex++
		})
	})
})()
