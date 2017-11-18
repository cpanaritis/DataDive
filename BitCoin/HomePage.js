paper.install(window);
window.onload = function () {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var left_hand = new Image();
	left_hand.src = 'http://projects.moritzklack.com/img/m-o-e/left_hand.png';
	var right_hand = new Image();
	right_hand.src = 'http://projects.moritzklack.com/img/m-o-e/right_hand.png';
	var money;
	var moneySign = document.getElementById('money');

	Hand = Raster;
	Hand.prototype.velocity = new Point(0, 0);
	Hand.prototype.acceleration = new Point(0, 0);
	Hand.prototype.mass;
	Hand.prototype.limit;
	Hand.prototype.angle = 0;

	Hand.prototype.applyPowerOfMoney = function (money_power) {
		var money_power = new Point(money_power.x / this.mass, money_power.y / this.mass);
		this.acceleration = this.acceleration.add(money_power);
	}

	Hand.prototype.update = function (money, delta) {
		this.velocity = this.velocity.add(this.acceleration);
		if (magnitude(this.velocity) > this.limit) {
			this.velocity = this.velocity.normalize();
			this.velocity = this.velocity.multiply(this.limit);
		}
		this.position = this.position.add(this.velocity);
		this.position = this.position.add(new Point(random(.2, 1), random(.2, 1)));
		this.acceleration = this.acceleration.multiply(0);
		this.image = this.position.x < money.x ? this.image = left_hand : this.image = right_hand;
		var deltaX = this.position.x - money.x;
		var deltaY = this.position.y - money.y;
		var angleDegrees = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
		angleDegrees = this.position.x < money.x ? angleDegrees - 180 : angleDegrees;
		this.rotate(-this.angle);
		this.angle = angleDegrees;
		this.rotate(this.angle);
	}

	Money = Point;
	Money.prototype.mass = 40;

	Money.prototype.getItNow = function (hand) {
		var force = new Point(this.x, this.y);
		force = force.subtract(hand.position);
		var distance = magnitude(force);
		distance = scale(distance, 10, 20);
		force = force.normalize();
		var strength = (2 * this.mass * hand.mass) / (distance * distance);
		force = force.multiply(strength);
		return force;
	}

	paper.setup(canvas);
	var money = new Money(canvas.width * .5, canvas.height * .5);

	document.onmousemove = function (e) {
		money.x = e.pageX;
		money.y = e.pageY;
		moneySign.style.top = money.y - 30 + 'px';
		moneySign.style.left = money.x - 5 + 'px';
	}

	left_hand.onload = function () {
		for (var i = 0; i < 50; i++) {
			if (window.CP.shouldStopExecution(1)) { break; }
			var hand = new Hand(left_hand);
			hand.position = new Point(Math.random() * canvas.width, Math.random() * canvas.height);
			hand.scale(random(.3, .8));
			hand.limit = random(5, 6);
			hand.mass = random(10, 12);
		}
		window.CP.exitedLoop(1);

		view.onFrame = function (event) {
			var hands = project.activeLayer.children;
			for (var j = 0; j < hands.length; j++) {
				if (window.CP.shouldStopExecution(2)) { break; }
				hands[j].update(money, event.delta);
				var money_power = money.getItNow(hands[j]);
				hands[j].applyPowerOfMoney(money_power);
			}
			window.CP.exitedLoop(2);

		}
	}

	random = function (a, b) {
		return Math.random() * (b - a) + a;
	}
	magnitude = function (vector) {
		return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
	}
	scale = function (value, min, max) {
		if (value < min) {
			value = min;
		}
		if (value > max) {
			value = max;
		}
		return value;
	}
}
//# sourceURL=pen.js