interface ChatMsg {
  u: boolean;
  t: string;
}

const convos: ChatMsg[][] = [
  [{ u: true, t: "Hola! \u00bfTienen precio especial para pedidos grandes?" }, { u: false, t: "\u00a1Hola! Soy Verkex Bot \ud83e\udd16\nS\u00ed, tenemos descuentos desde 50 unidades. \u00bfQu\u00e9 producto te interesa?" }, { u: true, t: "Necesito 200 unidades del producto A" }, { u: false, t: "Perfecto! Para 200 unidades tienes 18% de descuento.\n\ud83d\udce6 Precio unitario: S/. 45.00\n\ud83d\udcb0 Total: S/. 7,380.00\n\u00bfGenero una cotizaci\u00f3n ahora?" }],
  [{ u: true, t: "\u00bfA qu\u00e9 hora cierran?" }, { u: false, t: "\u00a1Hola! Atendemos Lun-S\u00e1b 9am-7pm \ud83d\udd50\nPero puedo ayudarte ahora mismo. \u00bfEn qu\u00e9 te ayudo?" }, { u: true, t: "Quiero hacer un pedido" }, { u: false, t: "Genial! Te paso con nuestro cat\u00e1logo actualizado.\n\ud83d\udccb Ver cat\u00e1logo \u2192 bit.ly/verkex-cat\nO dime qu\u00e9 buscas y te cotizo al instante \u26a1" }],
  [{ u: true, t: "Tienen stock del modelo X200?" }, { u: false, t: "Consultando inventario en tiempo real... \u26a1" }, { u: false, t: "\u2705 X200 disponible: 34 unidades\nPrecio regular: S/. 280\nEntrega: 24-48 horas\n\u00bfCu\u00e1ntas necesitas?" }, { u: true, t: "Dame 5 unidades" }, { u: false, t: "\u00a1Listo! Pedido #PED-8847 registrado \ud83c\udf89\nTotal: S/. 1,400\nTe enviamos confirmaci\u00f3n en segundos." }]
];

let ci = 0, mi = 0;

function nextMsg() {
  const c = document.getElementById('chatArea');
  if (!c) return;
  const conv = convos[ci % convos.length];
  if (mi >= conv.length) {
    ci++;
    mi = 0;
    setTimeout(() => {
      c.innerHTML = '';
      nextMsg();
    }, 2000);
    return;
  }
  const msg = conv[mi];
  if (!msg.u) {
    const typing = document.createElement('div');
    typing.className = 'chat-msg typing';
    typing.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    c.appendChild(typing);
    c.scrollTop = c.scrollHeight;
    setTimeout(() => {
      typing.remove();
      const d = document.createElement('div');
      d.className = 'chat-msg bot';
      d.innerHTML = msg.t.replace(/\n/g, '<br>');
      c.appendChild(d);
      c.scrollTop = c.scrollHeight;
      mi++;
      setTimeout(nextMsg, 2200);
    }, 900);
  } else {
    const d = document.createElement('div');
    d.className = 'chat-msg user';
    d.textContent = msg.t;
    c.appendChild(d);
    c.scrollTop = c.scrollHeight;
    mi++;
    setTimeout(nextMsg, 1200);
  }
}

nextMsg();
