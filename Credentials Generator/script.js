new Vue({
  el: '#app',
  data() {
    return {
      password: '',
      username: '',
      copied: false,
      settings: {
        maxLength: 64,
        maxDigits: 10,
        maxSymbols: 10,
        length: 12,
        digits: 4,
        symbols: 2,
        ambiguous: true,
      }
    };
  },
  computed: {
    lengthThumbPosition() {
      return ((this.settings.length - 6) / (this.settings.maxLength - 6)) * 100;
    },
    digitsThumbPosition() {
      return ((this.settings.digits - 0) / (this.settings.maxDigits - 0)) * 100;
    },
    symbolsThumbPosition() {
      return ((this.settings.symbols - 0) / (this.settings.maxSymbols - 0)) * 100;
    },
    strength() {
      const count = { upperCase: 0, numbers: 0, symbols: 0 };
      let baseScore = 30;

      for (let char of this.password) {
        if (char.match(/[A-Z]/)) count.upperCase++;
        if (char.match(/[0-9]/)) count.numbers++;
        if (char.match(/[\W_]/)) count.symbols++;
      }

      let score = baseScore + count.upperCase * 4 + count.numbers * 5 + count.symbols * 5;

      return {
        text: score < 50 ? 'weak' : score < 75 ? 'average' : score < 100 ? 'strong' : 'secure',
        score: Math.min(score, 100)
      };
    }
  },
  watch: {
    settings: {
      handler: 'generatePassword',
      deep: true
    }
  },
  methods: {
    copyToClipboard() {
      const textarea = document.createElement('textarea');
      textarea.value = this.password;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.copied = true;
      setTimeout(() => (this.copied = false), 750);
    },
    generatePassword() {
      const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const digits = '0123456789';
      const symbols = '!@#$%^&*';
      let pool = letters;
      let password = [];

      // Add digits to the pool
      for (let i = 0; i < this.settings.digits; i++) {
        const digit = digits.charAt(Math.floor(Math.random() * digits.length));
        password.push(digit);
      }

      // Add symbols to the pool
      for (let i = 0; i < this.settings.symbols; i++) {
        const symbol = symbols.charAt(Math.floor(Math.random() * symbols.length));
        password.push(symbol);
      }

      // Fill the rest with letters
      while (password.length < this.settings.length) {
        const letter = pool.charAt(Math.floor(Math.random() * pool.length));
        password.push(letter);
      }

      // Shuffle password array
      this.password = password
        .sort(() => Math.random() - 0.5)
        .join('');
    },
    generateUsername() {
      const adjectives = ['Cool', 'Smart', 'Swift', 'Happy', 'Bright', 'Bold', 'Quick'];
      const nouns = ['Fox', 'Tiger', 'Wolf', 'Eagle', 'Lion', 'Panda'];
      const randomNumber = Math.floor(Math.random() * 1000);
      this.username = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${
        nouns[Math.floor(Math.random() * nouns.length)]
      }${randomNumber}`;
    }
  },
  mounted() {
    this.generatePassword();
    this.generateUsername();
  }
});
