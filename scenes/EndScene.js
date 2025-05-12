export default class EndScene extends Phaser.Scene {
  constructor() {
    super("endScene");
  }

  init(data) {
    this.resultado = data.resultado;
    this.score = data.score;
  }

  Preload(){
    this.load.image("Menu", "assets/FondoMenu.jpg");

  }

  create() {
    this.add.image(400, 300, "Menu").setScale(1);
    const mensaje =
      this.resultado === "ganaste" ? "¡GANASTE!" : "GAME OVER";

    const color = this.resultado === "ganaste" ? "#00aa00" : "#aa0000";

    this.add.text(400, 200, mensaje, {
      fontSize: "64px",
      fill: color,
    }).setOrigin(0.5);

    this.add.text(400, 300, `Puntaje final: ${this.score}`, {
      fontSize: "32px",
      fill: "#000",
    }).setOrigin(0.5);

    this.add.text(400, 370, "Presiona R para reiniciar", {
      fontSize: "24px",
      fill: "#000",
    }).setOrigin(0.5);

    this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
      this.scene.start("game");
    }
  }
}