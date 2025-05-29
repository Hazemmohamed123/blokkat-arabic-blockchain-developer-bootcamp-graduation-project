async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const StudentVote = await ethers.getContractFactory("StudentVote");
  const contract = await StudentVote.deploy();

  await contract.deployed();

  console.log("StudentVote deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
