const SITE_URL = './content/site.json'
const SHOWS_URL = './content/shows.json'

function waLink(numberDigits, text) {
	return `https://wa.me/${numberDigits}?text=${encodeURIComponent(text)}`
}

function $(id) {
	return document.getElementById(id)
}

async function loadJson(url) {
	const res = await fetch(url, { cache: 'no-store' })
	if (!res.ok) throw new Error(`Failed to load ${url}`)
	return res.json()
}

function renderShows(showsData) {
	// Elements
	const grid = $('showsGrid')
	if (!grid) return

	const introTitleEl = $('showsIntroTitle')
	const introTextEl = $('showsIntroText')
	const heroWrapEl = $('showsHeroWrap')
	const heroImgEl = $('showsHeroImg')

	// Clear existing cards
	grid.innerHTML = ''

	// Defensive normalize
	const introTitle = showsData?.introTitle ?? 'הצגות'
	const introText = showsData?.introText ?? ''
	const heroImage = showsData?.heroImage ?? ''
	const items = Array.isArray(showsData?.items) ? showsData.items : []

	// Render intro
	if (introTitleEl) introTitleEl.textContent = introTitle
	if (introTextEl) introTextEl.textContent = introText

	// Render hero image (show/hide wrapper)
	if (heroImgEl && heroWrapEl) {
		if (heroImage && String(heroImage).trim()) {
			heroImgEl.src = heroImage
			heroImgEl.alt = introTitle ? `תמונה ראשית: ${introTitle}` : 'תמונה ראשית של ההצגות'
			heroWrapEl.hidden = false
		} else {
			heroImgEl.removeAttribute('src')
			heroWrapEl.hidden = true
		}
	}

	// Render show cards
	items.forEach(s => {
		const title = s?.title ?? ''
		const short = s?.short ?? ''
		const image = s?.image ?? ''

		const card = document.createElement('article')
		card.className = 'card show'

		// Image (optional)
		if (image && String(image).trim()) {
			const media = document.createElement('div')
			media.className = 'show-media'

			const img = document.createElement('img')
			img.src = image
			img.alt = title ? `תמונה מתוך: ${title}` : 'תמונה מתוך הצגה'
			img.loading = 'lazy'

			media.appendChild(img)
			card.appendChild(media)
		}

		const h3 = document.createElement('h3')
		h3.textContent = title
		card.appendChild(h3)

		if (short && String(short).trim()) {
			const p = document.createElement('p')
			p.textContent = short
			card.appendChild(p)
		}

		grid.appendChild(card)
	})
}ה

// Mobile menu toggle
document.addEventListener('click', e => {
	const toggle = document.querySelector('.nav-toggle')
	const menu = document.getElementById('mobileMenu')
	if (!toggle || !menu) return

	if (e.target === toggle) {
		const isOpen = toggle.getAttribute('aria-expanded') === 'true'
		toggle.setAttribute('aria-expanded', String(!isOpen))
		menu.hidden = isOpen
		return
	}

	// close on link click
	if (menu.contains(e.target) && e.target.tagName === 'A') {
		toggle.setAttribute('aria-expanded', 'false')
		menu.hidden = true
	}
})
;(async function init() {
	try {
		const site = await loadJson(SITE_URL)

		// ===============================
		// Announcement Bar
		// ===============================

		const bar = $('announcementBar')
		const barText = $('announcementText')
		const barBtn = $('announcementLink')

		if (site.announcementEnabled && site.announcementText) {
			bar.classList.remove('hidden')

			barText.textContent = site.announcementText

			if (site.announcementButtonText && site.announcementLink) {
				barBtn.textContent = site.announcementButtonText
				barBtn.href = site.announcementLink
				barBtn.style.display = 'inline-block'
			} else {
				barBtn.style.display = 'none'
			}

			// צבע
			const allowed = ['coral', 'bluegreen', 'freesia', 'fuchsia']
			if (allowed.includes(site.announcementColor)) {
				bar.classList.add(site.announcementColor)
			} else {
				bar.classList.add('coral')
			}
		} else {
			bar.classList.add('hidden')
		}

		const shows = await loadJson(SHOWS_URL)

		// Meta
		const metaDesc = document.querySelector('meta[name="description"]')
		if (metaDesc) metaDesc.setAttribute('content', site.seoDescription || '')

		// Header
		$('businessName').textContent = site.businessName || 'תיאטרון אנדי'
		$('ownerName').textContent = site.ownerName || 'חמוטל אנדי'

		// Hero/About/Video/Contact
		$('heroTitle').textContent = site.heroTitle || ''
		$('heroText').textContent = site.heroText || ''
		$('aboutTitle').textContent = site.aboutTitle || 'עליי'
		$('aboutText').textContent = site.aboutText || ''
		$('videoTitle').textContent = site.videoTitle || 'וידאו'
		$('videoText').textContent = site.videoText || ''
		$('contactTitle').textContent = site.contactTitle || 'צור קשר'
		$('contactText').textContent = site.contactText || ''
		$('area').textContent = site.cityOrArea || ''
		// Who section
		if ($('whoTitle')) $('whoTitle').textContent = site.whoTitle || 'תיאטרון אנדי'
		if ($('whoSubtitle')) $('whoSubtitle').textContent = site.whoSubtitle || ''
		if ($('whoText')) $('whoText').innerHTML = site.whoTextHtml || ''

		// Adapted section
		if ($('adaptedTitle')) $('adaptedTitle').textContent = site.adaptedTitle || 'תיאטרון מותאם'
		if ($('adaptedSubtitle')) $('adaptedSubtitle').textContent = site.adaptedSubtitle || ''
		if ($('adaptedText')) $('adaptedText').innerHTML = site.adaptedTextHtml || ''
		// YouTube
		const yt = $('ytFrame')
		if (yt && site.youtubeId && site.youtubeId !== 'VIDEO_ID') {
			yt.src = `https://www.youtube.com/embed/${site.youtubeId}`
		} else if (yt) {
			yt.src = 'about:blank'
		}

		// Phone + WhatsApp
		const phoneDigits = site.phoneIntlDigits || '972524329089'
		const phoneDisplay = site.phoneDisplay || '+972 52 432 9089'

		const waText = `היי חמוטל 🙂 רציתי לשמוע על הצגה/שעת סיפור למסגרת שלנו.`
		$('waLink').href = waLink(phoneDigits, waText)
		$('waFloat').href = waLink(phoneDigits, waText)

		const telLink = $('telLink')
		telLink.textContent = phoneDisplay
		telLink.href = `tel:+${phoneDigits}`

		// Shows
		renderShows(shows)

		// Contact form -> WhatsApp
		const form = $('contactForm')
		const hint = $('formHint')
		if (form) {
			form.addEventListener('submit', e => {
				e.preventDefault()
				const data = new FormData(form)
				const name = data.get('name')
				const phone = data.get('phone')
				const framework = data.get('framework')
				const message = data.get('message')

				const text = `היי חמוטל 🙂 כאן ${name}.
טלפון לחזרה: ${phone}
סוג מסגרת: ${framework}

פרטים על הקבוצה:
${message}

אפשר לדבר על התאמה למופע?`

				window.open(waLink(phoneDigits, text), '_blank', 'noopener')
				if (hint) hint.textContent = 'נפתח חלון וואטסאפ עם ההודעה (אם לא נפתח—בדקו חסימת פופאפים).'
			})
		}

		// Footer year
		$('year').textContent = new Date().getFullYear()
		$('footerName').textContent = site.businessName || 'תיאטרון אנדי'
	} catch (err) {
		console.error(err)
		// אם משהו נשבר, עדיין יישאר שלד קריא.
	}
})()
