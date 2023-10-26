const
file = "./FILES.BBS",
bbs = "https://github.com/lucianofullstack",
getFile = async (url) => {
  const data = await fetch(url)
  if (data.status === 200) {
    return await data.text()
  } else {
    return false
  }
},
parseFile = async (data) => {
  if (data) {
    return data
      .replace(/&#8202;/gm, " ")
      .replace(/(\S[\w.-]*)\s+(.*)/gm, "$1&#8202;$2")
      .split(/\r?\n|\r|\n/g)
      .filter(Boolean)
      .map(e => {
        let
          result = [];
        [result['link'],
        result['description']
        ] = e.trim().split("&#8202;", 2)
        result['name'] = result['link']
          .split('.')[1]
          .replace(/-/gm, ' ')
          .split(' ')
          .map(
            w => w[0].toUpperCase()
              + w.substring(1).toLowerCase()
          )
          .join(' ')
          .replace(/vs\s?code/i, '')
          .trim()
        return result
      }).sort((a, b) => {
        const
          keya = Object.keys(a)[2],
          keyb = Object.keys(b)[2]
        return keya.localeCompare(keyb)
          || a[keya].localeCompare(b[keyb])
      })
  } else {
    return false
  }
},
renderLinks = async (entries) => {
  if ( Array.isArray(entries) ) {
    entries.slice(0,19)
    if ( entries.length === 20) {
      const url = 'https://marketplace.visualstudio.com/items?itemName='
      let i = 0, len = entries.length, screen = document.getElementById("screen")
      while (i < len) {
        let
        p = document.createElement('p'),
        a = document.createElement('a')
        a.setAttribute('href', `${url}${entries[i].link}`);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noreferrer noopener nofollow');
        a.innerHTML = `${entries[i].name}<span>: ${entries[i].description.padEnd(72-entries[i].name.length," ")}</span>`
        p.appendChild(a)
        p.innerHTML = `<span>${String(i + 1).padStart(2, '0')}.</span> ${p.innerHTML}`
        screen.appendChild(p)
        i++
      }
    }
  }
},
themeSwitcher = async () => {
  const
  colors = ['amber', 'green', 'white'],
  hash = window.location.hash.slice(1),
  color = (color) => {
    const
    id = document.getElementById('color')
    id.className = "crt " + color
    localStorage.setItem('terminalcolor', color)
  }
  if (colors.includes(hash)) {
    color(hash)
  }
  else {
    let currentTheme = localStorage.getItem('terminalcolor')
    if (currentTheme) {
      if (colors.includes(currentTheme)) {
          color(currentTheme)
      }
    }
  }
  colors.forEach((col) => {
    id = document.getElementById('button' + col)
    id.addEventListener("click", function () { color(col) }, false)
  })
},
bbsLink = (bbs) => {
  element = document.getElementById('contact')
  element.url = bbs
  element
  .addEventListener("click",
  function (event) {
    document.location.href = event.currentTarget.url
  }, false)
};
( async (file) => {
  let result = await getFile(file)
  .then( result => parseFile(result))
  .then( result => renderLinks(result))
  themeSwitcher()
  bbsLink(bbs)
})(file)