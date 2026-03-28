import Web3 from "web3";

const web3 = new Web3("https://bsc-dataseed.binance.org/");
const ABI = [
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
];

const contract = new web3.eth.Contract(ABI, '0xc882910038927090b5c4e03d3dbe506a05168546');

export const getTokenCirculatingSupply = async () => {
  const totalCreatingSupply = String(await contract.methods.totalSupply().call());
  const totalSupply = "63000000000000000000000000";
  const burneds = String(
    await contract.methods.balanceOf("0x000000000000000000000000000000000000dead").call()
  );

  const zeroAddresss = String(
    await contract.methods.balanceOf("0x0000000000000000000000000000000000000000").call()
  );

  const finalBurn = BigInt(burneds) + BigInt(zeroAddresss);

  const burnedsss = BigInt(totalCreatingSupply) - BigInt(finalBurn);

  const burned = BigInt(totalSupply) - BigInt(burnedsss);


  return ({
    totalSupply: totalSupply.toString(),
    burned: burned.toString(),
    circulating: burnedsss.toString()
  });
}