
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
class Player{
	constructor(x ,y, radius, color)
	{
	   this.x = x
	   this.y = y
	   this.radius = radius
	   this.color = color
	}
	draw()
	{
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
		c.fillStyle = this.color
		c.fill()
	}
}

class Projectile{
	constructor(x, y, radius, color, velocity){
        this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
	}
	draw()
	{
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
		c.fillStyle = this.color
		c.fill()
	}
	update()
	{
		this.draw()
		this.x = this.x + this.velocity.x*5
		this.y = this.y + this.velocity.y*5
	}
}

class Particles{
	constructor(x, y, radius, color, velocity){
        this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
	}
	draw()
	{
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
		c.fillStyle = this.color
		c.fill()
	}
	update()
	{
		this.draw()
		this.x = this.x + this.velocity.x*5
		this.y = this.y + this.velocity.y*5
	}
}


class Enemies{
	constructor(x, y, radius, color, velocity){
        this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
	}
	draw()
	{
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
		c.fillStyle = this.color
		c.fill()
	}
	update()
	{
		this.draw()
		this.x = this.x + this.velocity.x*2
		this.y = this.y + this.velocity.y*2
	}
}


const enemies = []
function spawnEnemies(){
	setInterval(() => {
		let x
		let y
		const radius = Math.random()*(30-4) + 30
		if(Math.random() < 0.5)
		{
         x = Math.random()<0.5 ? 0 - radius : canvas.width + radius
		 y = Math.random()*canvas.height
		}
		else{
			y = Math.random()<0.5 ? 0 - radius : canvas.height + radius
			x = Math.random()*canvas.width
		}
		const color = `hsl(${Math.random()*360}, 50%, 50%)`
		const angle = Math.atan2(canvas.height/2-y, canvas.width/2-x)
		const velocity = {
			x: Math.cos(angle),
			y: Math.sin(angle)
		 }
		 enemies.push(
			new Enemies(x, y, radius, color, velocity)
		 )
	},1000)
}

const player = new Player(canvas.width/2, canvas.height/2, 30, 'white')
const projectiles = []
const particles = []
let scoreEl = document.getElementById('#score')
let score = 0
const audio = new Audio('./gunShot.mp3');
const reload = new Audio('./reload.mp3');
let counts  = 0;
function animate()
{
	const id = requestAnimationFrame(animate)
	c.fillStyle = 'rgba(0, 0, 0, 0.1)'
	c.fillRect(0, 0, canvas.width, canvas.height)
	player.draw()
	particles.forEach((particle)=>{
		particle.update()
	})
	projectiles.forEach((projectile)=>{
        projectile.update()
	})
	
	enemies.forEach((enemy, index)=>{
		enemy.update()
		const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
		if(dist - enemy.radius - player.radius < 1)
		{
          cancelAnimationFrame(id)
		}
		projectiles.forEach((projectile, projectileIndex)=>{
			const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
			if(dist - enemy.radius - projectile.radius < 1)
			{
				
				score=score+100
				console.log(score)
				scoreEl.innerHTML = score
				for(let i = 0; i<enemy.radius; i++)
				{
					particles.push(
						new Particles(projectile.x, projectile.y, Math.random()*2, enemy.color, {
							x: Math.random()-0.5,
							y: Math.random()-0.5
						})
					)
					
				}
				if(enemy.radius-10 > 10)
				{
					enemy.radius-=10
					setTimeout(()=>{
						projectiles.splice(projectileIndex, 1)
					},0)
				}
				enemies.splice(index, 1)
				projectiles.splice(projectileIndex, 1)
			}
		})
		
	})
}



addEventListener("click",(event)=>{
 const angle = Math.atan2(event.clientY-canvas.height/2, event.clientX-canvas.width/2)
 counts=counts+1;
 if(counts > 6)
 {
	counts = 0;
	reload.play()
 }
 audio.play();
 const velocity = {
	x: Math.cos(angle),
	y: Math.sin(angle)
 }
 projectiles.push(
	new Projectile(canvas.width/2, canvas.height/2, 5, 'white', velocity)
 )
})
animate()
spawnEnemies()
