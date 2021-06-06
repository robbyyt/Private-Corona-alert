import { generateSafePrime } from "./utils/primes";
import OTSender from "./OTSender";

(async () => {
  const p = await generateSafePrime();
  const q = await generateSafePrime();
  console.log(
    `Generated:
  p = ${p.value}
  q = ${q.value}
  `
  );

  const sender = new OTSender(p, q, 3, ["101", "010"]);
  console.log(sender.prepareInitialValues());
})();
