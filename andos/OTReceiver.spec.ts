import OTReceiver from "./OTReceiver";
import OTSender from "./OTSender";
import { generateSafePrime, computeJacobiLegendreSymbol } from "./utils/primes";


(async () => {
  const p = await generateSafePrime(32);
  const q = await generateSafePrime(32);
  console.log(
    `Generated:
  p = ${p.value}
  q = ${q.value}
  `
  );

  const sender = new OTSender(p, q, 1, ["1", "1", "1", "0", "0", "0"]);
  const{ n, y, zArray } = sender.prepareInitialValues();

  console.log(
    `Sender initial values:
  n = ${n}
  y = ${y}
  z[][] = ${zArray}
  `
  );

  const receiver = new OTReceiver(n, y, zArray);
  receiver.preparePermutationValues();
  const jacobiArr: number[] = [];

  for(let i = 0; i < receiver.sigmaPacket.length; i++) {
    for(let j = 0; j < receiver.sigmaPacket[i].length; j++) {
      jacobiArr.push(computeJacobiLegendreSymbol(receiver.sigmaPacket[i][j], n));
    }
  }

  console.log(
    `Receiver permutation values:
  sigma = ${receiver.sigma}
  inverse = ${receiver.sigmaInverse}
  packet = ${receiver.sigmaPacket}
  packet jacobi = ${jacobiArr}
  aValues = ${receiver.aValues}
  rValues = ${receiver.rValues}
  `
  );

  sender.setReceiverPacket(receiver.sigmaPacket);
  const msgIndex = 2;
  receiver.setChoice(msgIndex);
  console.log(`Receiver tries to retrieve message ${msgIndex}`);
  const senderResponse = sender.processReceiverRequest(receiver.sigma[msgIndex]);
  console.log(`Sender sends the following response: ${senderResponse}`);
  console.log(`Receiver computes: ${receiver.interpretSenderResponse(senderResponse)}`);
})();
