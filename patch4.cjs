const fs = require('fs');
let code = fs.readFileSync('src/components/BookingForm.tsx', 'utf8');

const target = `// If neither is configured, we'll still allow mock success so user can experience the flow and use WhatsApp direct link
      setIsSuccess(true);`;

const replacement = `// Minimum 1.5s delay to show the beautiful loading animation
      await new Promise(r => setTimeout(r, 1500));
      
      setIsSuccess(true);`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/BookingForm.tsx', code);
console.log('done delay');
