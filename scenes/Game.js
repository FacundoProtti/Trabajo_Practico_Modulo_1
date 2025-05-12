export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  init() {
    this.initialTime = 30;
    this.collectedShapes = [];
  }

  preload() {
    this.load.image("Cielo", "./public/assets/Cielo.webp");
    this.load.image("Diamante", "./public/assets/diamond.png");
    this.load.image("Menu", "./public/assets/FondoMenu.jpg");
    this.load.image("Ninja", "./public/assets/Ninja.png");
    this.load.image("Plataforma", "./public/assets/platform.png");
    this.load.image("Cuadrado", "./public/assets/square.png");
    this.load.image("Triangulo", "./public/assets/triangle.png");
    this.load.image("Circulo", "./public/assets/circle.png");
  }

  createRandomShape() {
    const tipos = ["Diamante", "Triangulo", "Cuadrado", "Circulo"];
    const tipoElegido = Phaser.Utils.Array.GetRandom(tipos);
    const objeto = this.shapes.create(Phaser.Math.Between(50, 750), 0, tipoElegido);
    if (tipoElegido === "Circulo") {
  objeto.setScale(0.125);
}
    objeto.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    objeto.setCollideWorldBounds(true);

    switch (tipoElegido) {
      case "Diamante":
        objeto.valor = 20;
        break;
      case "Triangulo":
        objeto.valor = 15;
        break;
      case "Cuadrado":
        objeto.valor = 10;
        break;
      case "Circulo":
        objeto.valor = -5;
        this.time.delayedCall(4000, () => {
        if (objeto.active) {
          objeto.disableBody(true, true);
        }
      });
      break;
    }
  }

  create() {
    this.add.image(400, 300, "Cielo").setScale(2);

    this.shapes = this.physics.add.group();

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, "Plataforma").setScale(2).refreshBody();
    this.platforms.create(400, 200, "Plataforma");
    this.platforms.create(50, 400, "Plataforma");
    this.platforms.create(750, 400, "Plataforma");

    this.player = this.physics.add.sprite(100, 450, "Ninja").setScale(0.1);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    this.score = 0;
    this.gameOver = false;

    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
      fontSize: "32px",
      fill: "#000",
    });

    this.timerText = this.add.text(600, 16, `Time: ${this.initialTime}`, {
      fontSize: "32px",
      fill: "#000",
    });

    this.timeEvent = this.time.addEvent({
      delay: 1000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });

    this.shapeTimer = this.time.addEvent({
      delay: 1000,
      callback: this.createRandomShape,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.shapes, this.platforms, this.onShapeBounce, null, this);
    this.physics.add.overlap(this.player, this.shapes, this.collectShape, null, this);
  }

  update() {
      if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
        this.scene.restart();
      }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  collectShape(player, shape) {
    shape.disableBody(true, true);

    let valor = 0;
    switch (shape.texture.key) {
      case "Diamante":
        valor = 20;
        break;
      case "Triangulo":
        valor = 15;
        break;
      case "Cuadrado":
        valor = 10;
        break;
      case "Circulo":
        valor = -5;
        break;
    }

    this.score += valor;
    this.scoreText.setText(`Score: ${this.score}`);
    this.collectedShapes.push(shape.texture.key);

    const counts = {
      Diamante: 0,
      Triangulo: 0,
      Cuadrado: 0,
    };

    this.collectedShapes.forEach(item => {
      if (counts[item] !== undefined) {
        counts[item]++;
      }
    });

    const ganóPorFormas = counts.Diamante >= 2 && counts.Triangulo >= 2 && counts.Cuadrado >= 2;
    const ganóPorPuntaje = this.score >= 100;

    if (ganóPorFormas || ganóPorPuntaje) {
      this.physics.pause();
      this.player.setTint(0x00ff00);
      this.shapeTimer.remove();
      this.timeEvent.remove();
      this.gameOver = true;
      this.scene.start("endScene", {
    resultado: "ganaste",
    score: this.score,
  });
    }
  }

  onShapeBounce(shape, platform) {
    if (shape.texture.key === "Circulo") {
      return;
    }
    if (typeof shape.valor === "number") {
      shape.valor -= 5;
      if (shape.valor <= 0) {
        shape.disableBody(true, true);
      }
    }
  }

  onSecond() {
    if (!this.gameOver) {
      this.initialTime -= 1;
      this.timerText.setText('Time: ' + this.initialTime);

      if (this.initialTime <= 0) {
  this.physics.pause();
  this.player.setTint(0xff0000);
  this.gameOver = true;
  this.scene.start("endScene", {
    resultado: "perdiste",
    score: this.score,
  });
}
    }
  }   
}