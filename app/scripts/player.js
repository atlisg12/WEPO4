
window.Player = (function() {
	'use strict';

	var Controls = window.Controls;

	// All these constants are in em's, multiply by 10 pixels
	// for 1024x576px canvas.
	var SPEED = 5; // * 10 pixels per second
	var WIDTH = 5;
	var HEIGHT = 5;
	var INITIAL_POSITION_X = 30;
	var INITIAL_POSITION_Y = 25;
	var GRAVITY = 0.5;

	var Player = function(el, game) {
		this.el = el;
		this.game = game;
		this.isJumping = false;
		this.JUMP_SPEED = SPEED-3;
		this.WIDTH  = document.getElementsByClassName('Player').offsetWidth;
		this.HEIGHT = document.getElementsByClassName('Player').offsetHeight;
		this.jumped = false;
		this.pos = { x: 0, y: 0 };
	};

	/**
	 * Resets the state of the player for a new game.
	 */
	Player.prototype.reset = function() {
		this.pos.x = INITIAL_POSITION_X;
		this.pos.y = INITIAL_POSITION_Y;
		SPEED = 0;
		this.isJumping = false;
	};

	Player.prototype.onFrame = function() {
		if (this.game.hasStarted) {
			this.pos.y += GRAVITY;
		} else {
			this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
		}

		this.jumped = Controls.didJump();
		if (this.jumped) {
			this.game.hasStarted = true;
			SPEED = this.JUMP_SPEED;
			var flap = document.getElementById('FlapSound');
			if(!muted) {
				flap.pause();
				flap.currentTime = 0;
				flap.play();
			}
		}

		if (this.jumped && !this.isJumping) {
			this.game.isPlaying = true;
			this.isJumping = true;
		} else if (this.jumped && this.isJumping) {
			SPEED = (this.JUMP_SPEED);
			return;
		}

		if (this.isJumping) {
			this.pos.y -= SPEED;
			if ((SPEED -= 0.10) < 0) {
				this.isJumping = false;
			}
			// Update UI
			this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em) rotate(-' + SPEED * 15 + 'deg)');
		} else {
			if (SPEED < 2)
				SPEED += 0.5;
			else
				SPEED = (this.JUMP_SPEED);
			if (this.game.hasStarted) {
			this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em) rotate(' + SPEED * 15 + 'deg)');
		}
		}
		this.checkCollisionWithBounds();

	};

	Player.prototype.checkCollisionWithBounds = function() {
		if (this.pos.x < 0 ||
			this.pos.x + WIDTH > this.game.WORLD_WIDTH ||
			this.pos.y < 0 ||
			this.pos.y + HEIGHT > this.game.WORLD_HEIGHT-(10.4/2)) {
			return this.game.gameover();
		}
	};

	return Player;

})();
