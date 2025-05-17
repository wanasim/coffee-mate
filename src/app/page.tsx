"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { type Address, parseEther } from "viem";
import { useEffect } from "react";

const FUND_ME_ABI = {
  abi: [
    {
      type: "constructor",
      inputs: [
        {
          name: "priceFeed",
          type: "address",
          internalType: "address",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "MINIMUM_USD",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "cheaperWithdraw",
      inputs: [],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "fund",
      inputs: [],
      outputs: [],
      stateMutability: "payable",
    },
    {
      type: "function",
      name: "getAddressToAmountFunded",
      inputs: [
        {
          name: "fundingAddress",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getFunder",
      inputs: [
        {
          name: "index",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "address",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getFunders",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address[]",
          internalType: "address[]",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getOwner",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "address",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getPriceFeed",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "contract AggregatorV3Interface",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getVersion",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "withdraw",
      inputs: [],
      outputs: [],
      stateMutability: "nonpayable",
    },
    { type: "error", name: "FundMe__NotOwner", inputs: [] },
  ],
  bytecode: {
    object:
      "0x60a060405234801561001057600080fd5b50604051610abe380380610abe83398101604081905261002f91610058565b600280546001600160a01b0319166001600160a01b039290921691909117905533608052610088565b60006020828403121561006a57600080fd5b81516001600160a01b038116811461008157600080fd5b9392505050565b6080516109ff6100bf6000396000818161013601528181610269015281816103200152818161049901526105ab01526109ff6000f3fe6080604052600436106100915760003560e01c80639e87a5cd116100595780639e87a5cd1461016e578063b60d42881461018c578063be2693f014610194578063d7b4750c146101a9578063ea63a044146101c957600080fd5b80630343fb25146100965780630d8e6e2c146100df5780633ccfd60b146100f45780636b69a5921461010b578063893d20e814610127575b600080fd5b3480156100a257600080fd5b506100cc6100b13660046107f1565b6001600160a01b031660009081526001602052604090205490565b6040519081526020015b60405180910390f35b3480156100eb57600080fd5b506100cc6101eb565b34801561010057600080fd5b5061010961025e565b005b34801561011757600080fd5b506100cc674563918244f4000081565b34801561013357600080fd5b507f00000000000000000000000000000000000000000000000000000000000000005b6040516001600160a01b0390911681526020016100d6565b34801561017a57600080fd5b506002546001600160a01b0316610156565b61010961039f565b3480156101a057600080fd5b5061010961048e565b3480156101b557600080fd5b506101566101c436600461081a565b61062b565b3480156101d557600080fd5b506101de61065a565b6040516100d69190610833565b6002546040805163054fd4d560e41b815290516000926001600160a01b0316916354fd4d509160048083019260209291908290030181865afa158015610235573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102599190610880565b905090565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146102a75760405163579610db60e01b815260040160405180910390fd5b60005b6000548110156102fd5760008082815481106102c8576102c8610899565b60009182526020808320909101546001600160a01b0316825260019052604081205550806102f5816108c5565b9150506102aa565b506040805160008082526020820192839052905161031b9290610777565b5060007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03164760405160006040518083038185875af1925050503d8060008114610389576040519150601f19603f3d011682016040523d82523d6000602084013e61038e565b606091505b505090508061039c57600080fd5b50565b600254674563918244f40000906103c09034906001600160a01b03166106bc565b10156104125760405162461bcd60e51b815260206004820152601b60248201527f596f75206e65656420746f207370656e64206d6f726520455448210000000000604482015260640160405180910390fd5b33600090815260016020526040812054900361046857600080546001810182559080527f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e5630180546001600160a01b031916331790555b33600090815260016020526040812080543492906104879084906108de565b9091555050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146104d75760405163579610db60e01b815260040160405180910390fd5b600080546040805160208084028201810190925282815291839183018282801561052a57602002820191906000526020600020905b81546001600160a01b0316815260019091019060200180831161050c575b5050505050905060005b815181101561058857600082828151811061055157610551610899565b6020908102919091018101516001600160a01b03166000908152600190915260408120555080610580816108c5565b915050610534565b50604080516000808252602082019283905290516105a69290610777565b5060007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03164760405160006040518083038185875af1925050503d8060008114610614576040519150601f19603f3d011682016040523d82523d6000602084013e610619565b606091505b505090508061062757600080fd5b5050565b600080828154811061063f5761063f610899565b6000918252602090912001546001600160a01b031692915050565b606060008054806020026020016040519081016040528092919081815260200182805480156106b257602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610694575b5050505050905090565b6000806106c8836106f4565b90506000670de0b6b3a76400006106df86846108f1565b6106e99190610908565b925050505b92915050565b600080826001600160a01b031663feaf968c6040518163ffffffff1660e01b815260040160a060405180830381865afa158015610735573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107599190610949565b505050915050806402540be4006107709190610999565b9392505050565b8280548282559060005260206000209081019282156107cc579160200282015b828111156107cc57825182546001600160a01b0319166001600160a01b03909116178255602090920191600190910190610797565b506107d89291506107dc565b5090565b5b808211156107d857600081556001016107dd565b60006020828403121561080357600080fd5b81356001600160a01b038116811461077057600080fd5b60006020828403121561082c57600080fd5b5035919050565b6020808252825182820181905260009190848201906040850190845b818110156108745783516001600160a01b03168352928401929184019160010161084f565b50909695505050505050565b60006020828403121561089257600080fd5b5051919050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000600182016108d7576108d76108af565b5060010190565b808201808211156106ee576106ee6108af565b80820281158282048414176106ee576106ee6108af565b60008261092557634e487b7160e01b600052601260045260246000fd5b500490565b805169ffffffffffffffffffff8116811461094457600080fd5b919050565b600080600080600060a0868803121561096157600080fd5b61096a8661092a565b945060208601519350604086015192506060860151915061098d6080870161092a565b90509295509295909350565b80820260008212600160ff1b841416156109b5576109b56108af565b81810583148215176106ee576106ee6108af56fea2646970667358221220b81189b0c0486e937560a057916b94f7dad75e6478202ab06f464a35a180d09f64736f6c63430008130033",
    sourceMap:
      "513:3419:1:-:0;;;1232:124;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;1273:11;:46;;-1:-1:-1;;;;;;1273:46:1;-1:-1:-1;;;;;1273:46:1;;;;;;;;;;1339:10;1329:20;;513:3419;;14:290:3;84:6;137:2;125:9;116:7;112:23;108:32;105:52;;;153:1;150;143:12;105:52;179:16;;-1:-1:-1;;;;;224:31:3;;214:42;;204:70;;270:1;267;260:12;204:70;293:5;14:290;-1:-1:-1;;;14:290:3:o;:::-;513:3419:1;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;",
    linkReferences: {},
  },
  deployedBytecode: {
    object:
      "0x6080604052600436106100915760003560e01c80639e87a5cd116100595780639e87a5cd1461016e578063b60d42881461018c578063be2693f014610194578063d7b4750c146101a9578063ea63a044146101c957600080fd5b80630343fb25146100965780630d8e6e2c146100df5780633ccfd60b146100f45780636b69a5921461010b578063893d20e814610127575b600080fd5b3480156100a257600080fd5b506100cc6100b13660046107f1565b6001600160a01b031660009081526001602052604090205490565b6040519081526020015b60405180910390f35b3480156100eb57600080fd5b506100cc6101eb565b34801561010057600080fd5b5061010961025e565b005b34801561011757600080fd5b506100cc674563918244f4000081565b34801561013357600080fd5b507f00000000000000000000000000000000000000000000000000000000000000005b6040516001600160a01b0390911681526020016100d6565b34801561017a57600080fd5b506002546001600160a01b0316610156565b61010961039f565b3480156101a057600080fd5b5061010961048e565b3480156101b557600080fd5b506101566101c436600461081a565b61062b565b3480156101d557600080fd5b506101de61065a565b6040516100d69190610833565b6002546040805163054fd4d560e41b815290516000926001600160a01b0316916354fd4d509160048083019260209291908290030181865afa158015610235573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102599190610880565b905090565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146102a75760405163579610db60e01b815260040160405180910390fd5b60005b6000548110156102fd5760008082815481106102c8576102c8610899565b60009182526020808320909101546001600160a01b0316825260019052604081205550806102f5816108c5565b9150506102aa565b506040805160008082526020820192839052905161031b9290610777565b5060007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03164760405160006040518083038185875af1925050503d8060008114610389576040519150601f19603f3d011682016040523d82523d6000602084013e61038e565b606091505b505090508061039c57600080fd5b50565b600254674563918244f40000906103c09034906001600160a01b03166106bc565b10156104125760405162461bcd60e51b815260206004820152601b60248201527f596f75206e65656420746f207370656e64206d6f726520455448210000000000604482015260640160405180910390fd5b33600090815260016020526040812054900361046857600080546001810182559080527f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e5630180546001600160a01b031916331790555b33600090815260016020526040812080543492906104879084906108de565b9091555050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146104d75760405163579610db60e01b815260040160405180910390fd5b600080546040805160208084028201810190925282815291839183018282801561052a57602002820191906000526020600020905b81546001600160a01b0316815260019091019060200180831161050c575b5050505050905060005b815181101561058857600082828151811061055157610551610899565b6020908102919091018101516001600160a01b03166000908152600190915260408120555080610580816108c5565b915050610534565b50604080516000808252602082019283905290516105a69290610777565b5060007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03164760405160006040518083038185875af1925050503d8060008114610614576040519150601f19603f3d011682016040523d82523d6000602084013e610619565b606091505b505090508061062757600080fd5b5050565b600080828154811061063f5761063f610899565b6000918252602090912001546001600160a01b031692915050565b606060008054806020026020016040519081016040528092919081815260200182805480156106b257602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610694575b5050505050905090565b6000806106c8836106f4565b90506000670de0b6b3a76400006106df86846108f1565b6106e99190610908565b925050505b92915050565b600080826001600160a01b031663feaf968c6040518163ffffffff1660e01b815260040160a060405180830381865afa158015610735573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107599190610949565b505050915050806402540be4006107709190610999565b9392505050565b8280548282559060005260206000209081019282156107cc579160200282015b828111156107cc57825182546001600160a01b0319166001600160a01b03909116178255602090920191600190910190610797565b506107d89291506107dc565b5090565b5b808211156107d857600081556001016107dd565b60006020828403121561080357600080fd5b81356001600160a01b038116811461077057600080fd5b60006020828403121561082c57600080fd5b5035919050565b6020808252825182820181905260009190848201906040850190845b818110156108745783516001600160a01b03168352928401929184019160010161084f565b50909695505050505050565b60006020828403121561089257600080fd5b5051919050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000600182016108d7576108d76108af565b5060010190565b808201808211156106ee576106ee6108af565b80820281158282048414176106ee576106ee6108af565b60008261092557634e487b7160e01b600052601260045260246000fd5b500490565b805169ffffffffffffffffffff8116811461094457600080fd5b919050565b600080600080600060a0868803121561096157600080fd5b61096a8661092a565b945060208601519350604086015192506060860151915061098d6080870161092a565b90509295509295909350565b80820260008212600160ff1b841416156109b5576109b56108af565b81810583148215176106ee576106ee6108af56fea2646970667358221220b81189b0c0486e937560a057916b94f7dad75e6478202ab06f464a35a180d09f64736f6c63430008130033",
    sourceMap:
      "513:3419:1:-:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;3270:151;;;;;;;;;;-1:-1:-1;3270:151:1;;;;;:::i;:::-;-1:-1:-1;;;;;3375:39:1;3349:7;3375:39;;;:23;:39;;;;;;;3270:151;;;;451:25:3;;;439:2;424:18;3270:151:1;;;;;;;;3427:97;;;;;;;;;;;;;:::i;1951:561::-;;;;;;;;;;;;;:::i;:::-;;622:50;;;;;;;;;;;;660:12;622:50;;3740:81;;;;;;;;;;-1:-1:-1;3807:7:1;3740:81;;;-1:-1:-1;;;;;651:32:3;;;633:51;;621:2;606:18;3740:81:1;487:203:3;3827:103:1;;;;;;;;;;-1:-1:-1;3912:11:1;;-1:-1:-1;;;;;3912:11:1;3827:103;;1424:418;;;:::i;2518:541::-;;;;;;;;;;;;;:::i;3530:104::-;;;;;;;;;;-1:-1:-1;3530:104:1;;;;;:::i;:::-;;:::i;3640:94::-;;;;;;;;;;;;;:::i;:::-;;;;;;;:::i;3427:97::-;3496:11;;:21;;;-1:-1:-1;;;3496:21:1;;;;3470:7;;-1:-1:-1;;;;;3496:11:1;;:19;;:21;;;;;;;;;;;;;;:11;:21;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;3489:28;;3427:97;:::o;1951:561::-;989:10;-1:-1:-1;;;;;1003:7:1;989:21;;985:52;;1019:18;;-1:-1:-1;;;1019:18:1;;;;;;;;;;;985:52;2083:19:::1;2078:190;2122:9;:16:::0;2108:30;::::1;2078:190;;;2169:14;2186:9:::0;2196:11:::1;2186:22;;;;;;;;:::i;:::-;;::::0;;;::::1;::::0;;;;;::::1;::::0;-1:-1:-1;;;;;2186:22:1::1;2222:31:::0;;2186:22;2222:31;;;;;:35;-1:-1:-1;2140:13:1;::::1;::::0;::::1;:::i;:::-;;;;2078:190;;;-1:-1:-1::0;2289:16:1::1;::::0;;2303:1:::1;2289:16:::0;;;::::1;::::0;::::1;::::0;;;;2277:28;;::::1;::::0;2289:16;2277:28:::1;:::i;:::-;;2416:12;2433:7;-1:-1:-1::0;;;;;2433:12:1::1;2453:21;2433:46;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2415:64;;;2497:7;2489:16;;;::::0;::::1;;1988:524;1951:561::o:0;1424:418::-;1501:11;;660:12;;1473:40;;:9;;-1:-1:-1;;;;;1501:11:1;1473:27;:40::i;:::-;:55;;1465:95;;;;-1:-1:-1;;;1465:95:1;;2916:2:3;1465:95:1;;;2898:21:3;2955:2;2935:18;;;2928:30;2994:29;2974:18;;;2967:57;3041:18;;1465:95:1;;;;;;;;1709:10;1685:35;;;;:23;:35;;;;;;:40;;1681:97;;1741:9;:26;;;;;;;;;;;;;;-1:-1:-1;;;;;;1741:26:1;1756:10;1741:26;;;1681:97;1811:10;1787:35;;;;:23;:35;;;;;:48;;1826:9;;1787:35;:48;;1826:9;;1787:48;:::i;:::-;;;;-1:-1:-1;;1424:418:1:o;2518:541::-;989:10;-1:-1:-1;;;;;1003:7:1;989:21;;985:52;;1019:18;;-1:-1:-1;;;1019:18:1;;;;;;;;;;;985:52;2572:24:::1;:36:::0;;::::1;::::0;;::::1;::::0;;::::1;::::0;;;;;;;;;;;:24;;:36;::::1;:24:::0;:36;;::::1;;;;;;;;;;;;;;;;::::0;;-1:-1:-1;;;;;2572:36:1::1;::::0;;;;;::::1;::::0;::::1;;::::0;;::::1;;;;;;;;;;;2670:19;2665:186;2709:7;:14;2695:11;:28;2665:186;;;2754:14;2771:7;2779:11;2771:20;;;;;;;;:::i;:::-;;::::0;;::::1;::::0;;;;;;;-1:-1:-1;;;;;2805:31:1::1;2839:1;2805:31:::0;;;:23:::1;:31:::0;;;;;;:35;-1:-1:-1;2725:13:1;::::1;::::0;::::1;:::i;:::-;;;;2665:186;;;-1:-1:-1::0;2872:16:1::1;::::0;;2886:1:::1;2872:16:::0;;;::::1;::::0;::::1;::::0;;;;2860:28;;::::1;::::0;2872:16;2860:28:::1;:::i;:::-;;2963:12;2980:7;-1:-1:-1::0;;;;;2980:12:1::1;3000:21;2980:46;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2962:64;;;3044:7;3036:16;;;::::0;::::1;;2562:497;;2518:541::o:0;3530:104::-;3585:7;3611:9;3621:5;3611:16;;;;;;;;:::i;:::-;;;;;;;;;;;-1:-1:-1;;;;;3611:16:1;;3530:104;-1:-1:-1;;3530:104:1:o;3640:94::-;3683:16;3718:9;3711:16;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;;;;;3711:16:1;;;;;;;;;;;;;;;;;;;;;;;3640:94;:::o;589:355:2:-;691:7;710:16;729:19;738:9;729:8;:19::i;:::-;710:38;-1:-1:-1;758:22:2;808:19;784:20;795:9;710:38;784:20;:::i;:::-;783:44;;;;:::i;:::-;758:69;-1:-1:-1;;;589:355:2;;;;;:::o;207:232::-;281:7;303:13;323:9;-1:-1:-1;;;;;323:25:2;;:27;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;300:50;;;;;;411:6;420:11;411:20;;;;:::i;:::-;396:36;207:232;-1:-1:-1;;;207:232:2:o;-1:-1:-1:-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;:::o;:::-;;;;;;;;;;;;;;;14:286:3;73:6;126:2;114:9;105:7;101:23;97:32;94:52;;;142:1;139;132:12;94:52;168:23;;-1:-1:-1;;;;;220:31:3;;210:42;;200:70;;266:1;263;256:12;931:180;990:6;1043:2;1031:9;1022:7;1018:23;1014:32;1011:52;;;1059:1;1056;1049:12;1011:52;-1:-1:-1;1082:23:3;;931:180;-1:-1:-1;931:180:3:o;1116:658::-;1287:2;1339:21;;;1409:13;;1312:18;;;1431:22;;;1258:4;;1287:2;1510:15;;;;1484:2;1469:18;;;1258:4;1553:195;1567:6;1564:1;1561:13;1553:195;;;1632:13;;-1:-1:-1;;;;;1628:39:3;1616:52;;1723:15;;;;1688:12;;;;1664:1;1582:9;1553:195;;;-1:-1:-1;1765:3:3;;1116:658;-1:-1:-1;;;;;;1116:658:3:o;1779:184::-;1849:6;1902:2;1890:9;1881:7;1877:23;1873:32;1870:52;;;1918:1;1915;1908:12;1870:52;-1:-1:-1;1941:16:3;;1779:184;-1:-1:-1;1779:184:3:o;1968:127::-;2029:10;2024:3;2020:20;2017:1;2010:31;2060:4;2057:1;2050:15;2084:4;2081:1;2074:15;2100:127;2161:10;2156:3;2152:20;2149:1;2142:31;2192:4;2189:1;2182:15;2216:4;2213:1;2206:15;2232:135;2271:3;2292:17;;;2289:43;;2312:18;;:::i;:::-;-1:-1:-1;2359:1:3;2348:13;;2232:135::o;3070:125::-;3135:9;;;3156:10;;;3153:36;;;3169:18;;:::i;3200:168::-;3273:9;;;3304;;3321:15;;;3315:22;;3301:37;3291:71;;3342:18;;:::i;3373:217::-;3413:1;3439;3429:132;;3483:10;3478:3;3474:20;3471:1;3464:31;3518:4;3515:1;3508:15;3546:4;3543:1;3536:15;3429:132;-1:-1:-1;3575:9:3;;3373:217::o;3595:179::-;3673:13;;3726:22;3715:34;;3705:45;;3695:73;;3764:1;3761;3754:12;3695:73;3595:179;;;:::o;3779:473::-;3882:6;3890;3898;3906;3914;3967:3;3955:9;3946:7;3942:23;3938:33;3935:53;;;3984:1;3981;3974:12;3935:53;4007:39;4036:9;4007:39;:::i;:::-;3997:49;;4086:2;4075:9;4071:18;4065:25;4055:35;;4130:2;4119:9;4115:18;4109:25;4099:35;;4174:2;4163:9;4159:18;4153:25;4143:35;;4197:49;4241:3;4230:9;4226:19;4197:49;:::i;:::-;4187:59;;3779:473;;;;;;;;:::o;4257:237::-;4329:9;;;4296:7;4354:9;;-1:-1:-1;;;4365:18:3;;4350:34;4347:60;;;4387:18;;:::i;:::-;4460:1;4451:7;4446:16;4443:1;4440:23;4436:1;4429:9;4426:38;4416:72;;4468:18;;:::i",
    linkReferences: {},
    immutableReferences: {
      "66": [
        { start: 310, length: 32 },
        { start: 617, length: 32 },
        { start: 800, length: 32 },
        { start: 1177, length: 32 },
        { start: 1451, length: 32 },
      ],
    },
  },
  methodIdentifiers: {
    "MINIMUM_USD()": "6b69a592",
    "cheaperWithdraw()": "be2693f0",
    "fund()": "b60d4288",
    "getAddressToAmountFunded(address)": "0343fb25",
    "getFunder(uint256)": "d7b4750c",
    "getFunders()": "ea63a044",
    "getOwner()": "893d20e8",
    "getPriceFeed()": "9e87a5cd",
    "getVersion()": "0d8e6e2c",
    "withdraw()": "3ccfd60b",
  },
  rawMetadata:
    '{"compiler":{"version":"0.8.19+commit.7dd6d404"},"language":"Solidity","output":{"abi":[{"inputs":[{"internalType":"address","name":"priceFeed","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"FundMe__NotOwner","type":"error"},{"inputs":[],"name":"MINIMUM_USD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cheaperWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"fund","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"fundingAddress","type":"address"}],"name":"getAddressToAmountFunded","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getFunder","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getFunders","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPriceFeed","outputs":[{"internalType":"contract AggregatorV3Interface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getVersion","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}],"devdoc":{"author":"Patrick Collins","details":"This implements price feeds as our library","kind":"dev","methods":{"getAddressToAmountFunded(address)":{"params":{"fundingAddress":"the address of the funder"},"returns":{"_0":"the amount funded"}}},"title":"A sample Funding Contract","version":1},"userdoc":{"kind":"user","methods":{"fund()":{"notice":"Funds our contract based on the ETH/USD price"},"getAddressToAmountFunded(address)":{"notice":"Gets the amount that an address has funded"}},"notice":"This contract is for creating a sample funding contract","version":1}},"settings":{"compilationTarget":{"src/FundMe.sol":"FundMe"},"evmVersion":"paris","libraries":{},"metadata":{"bytecodeHash":"ipfs"},"optimizer":{"enabled":true,"runs":200},"remappings":[":@openzeppelin/=lib/openzeppelin-contracts/",":chainlink-brownie-contracts/=lib/chainlink-brownie-contracts/contracts/",":forge-std/=lib/forge-std/src/",":foundry-devops/=lib/foundry-devops/"]},"sources":{"lib/chainlink-brownie-contracts/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol":{"keccak256":"0x257a8d28fa83d3d942547c8e129ef465e4b5f3f31171e7be4739a4c98da6b4f0","license":"MIT","urls":["bzz-raw://6d39e11b1dc7b9b8ccdabbc9be442ab7cda4a81c748f57e316dcb1bcb4a28bf9","dweb:/ipfs/QmaG6vz6W6iEUBsbHSBob5mdcitYxWjoygxREHpsJHfWrS"]},"src/FundMe.sol":{"keccak256":"0x72726a2e62c7aa2ed2eeafdbaf81648164fb138034a66d2f11ac85ab92190a10","license":"MIT","urls":["bzz-raw://c4f7836cab39d2c9dcbcc90f4e757801a0e9ebc2dd36f6a132bd69c7c5992104","dweb:/ipfs/QmTecSeThoeQjYSHoq1uFLYESHmCiC4nzbgJgWKUBJQu6B"]},"src/PriceConverter.sol":{"keccak256":"0x892beadc5207d6326234eec76f9e2552040780d2cb07bc9dc0805c28285a9a96","license":"MIT","urls":["bzz-raw://8bae689302f84a62022f4d74cc605cbdbabe02f39071a6944d4d547949326d55","dweb:/ipfs/QmSwsjRtfMLgbRKRPW6V3ZBdMbkDqGpkzoDRTz1Unprekm"]}},"version":1}',
  metadata: {
    compiler: { version: "0.8.19+commit.7dd6d404" },
    language: "Solidity",
    output: {
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "priceFeed",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          type: "error",
          name: "FundMe__NotOwner",
        },
        {
          inputs: [],
          stateMutability: "view",
          type: "function",
          name: "MINIMUM_USD",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
        },
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "function",
          name: "cheaperWithdraw",
        },
        {
          inputs: [],
          stateMutability: "payable",
          type: "function",
          name: "fund",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "fundingAddress",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
          name: "getAddressToAmountFunded",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "index",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
          name: "getFunder",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
        },
        {
          inputs: [],
          stateMutability: "view",
          type: "function",
          name: "getFunders",
          outputs: [
            {
              internalType: "address[]",
              name: "",
              type: "address[]",
            },
          ],
        },
        {
          inputs: [],
          stateMutability: "view",
          type: "function",
          name: "getOwner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
        },
        {
          inputs: [],
          stateMutability: "view",
          type: "function",
          name: "getPriceFeed",
          outputs: [
            {
              internalType:
                "contract AggregatorV3Interface",
              name: "",
              type: "address",
            },
          ],
        },
        {
          inputs: [],
          stateMutability: "view",
          type: "function",
          name: "getVersion",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
        },
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "function",
          name: "withdraw",
        },
      ],
      devdoc: {
        kind: "dev",
        methods: {
          "getAddressToAmountFunded(address)": {
            params: {
              fundingAddress: "the address of the funder",
            },
            returns: { _0: "the amount funded" },
          },
        },
        version: 1,
      },
      userdoc: {
        kind: "user",
        methods: {
          "fund()": {
            notice:
              "Funds our contract based on the ETH/USD price",
          },
          "getAddressToAmountFunded(address)": {
            notice:
              "Gets the amount that an address has funded",
          },
        },
        version: 1,
      },
    },
    settings: {
      remappings: [
        "@openzeppelin/=lib/openzeppelin-contracts/",
        "chainlink-brownie-contracts/=lib/chainlink-brownie-contracts/contracts/",
        "forge-std/=lib/forge-std/src/",
        "foundry-devops/=lib/foundry-devops/",
      ],
      optimizer: { enabled: true, runs: 200 },
      metadata: { bytecodeHash: "ipfs" },
      compilationTarget: { "src/FundMe.sol": "FundMe" },
      evmVersion: "paris",
      libraries: {},
    },
    sources: {
      "lib/chainlink-brownie-contracts/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol":
        {
          keccak256:
            "0x257a8d28fa83d3d942547c8e129ef465e4b5f3f31171e7be4739a4c98da6b4f0",
          urls: [
            "bzz-raw://6d39e11b1dc7b9b8ccdabbc9be442ab7cda4a81c748f57e316dcb1bcb4a28bf9",
            "dweb:/ipfs/QmaG6vz6W6iEUBsbHSBob5mdcitYxWjoygxREHpsJHfWrS",
          ],
          license: "MIT",
        },
      "src/FundMe.sol": {
        keccak256:
          "0x72726a2e62c7aa2ed2eeafdbaf81648164fb138034a66d2f11ac85ab92190a10",
        urls: [
          "bzz-raw://c4f7836cab39d2c9dcbcc90f4e757801a0e9ebc2dd36f6a132bd69c7c5992104",
          "dweb:/ipfs/QmTecSeThoeQjYSHoq1uFLYESHmCiC4nzbgJgWKUBJQu6B",
        ],
        license: "MIT",
      },
      "src/PriceConverter.sol": {
        keccak256:
          "0x892beadc5207d6326234eec76f9e2552040780d2cb07bc9dc0805c28285a9a96",
        urls: [
          "bzz-raw://8bae689302f84a62022f4d74cc605cbdbabe02f39071a6944d4d547949326d55",
          "dweb:/ipfs/QmSwsjRtfMLgbRKRPW6V3ZBdMbkDqGpkzoDRTz1Unprekm",
        ],
        license: "MIT",
      },
    },
    version: 1,
  },
  id: 1,
};

if (!process.env.NEXT_PUBLIC_FUND_ME_CONTRACT_ADDRESS) {
  throw new Error(
    "Missing NEXT_PUBLIC_FUND_ME_CONTRACT_ADDRESS environment variable"
  );
}

const FUND_ME_ADDRESS = process.env
  .NEXT_PUBLIC_FUND_ME_CONTRACT_ADDRESS as `0x${string}`;

export default function Home() {
  const { address, isConnected } = useAccount();

  const { data: balance, refetch: refetchBalance } =
    useBalance({
      address: FUND_ME_ADDRESS,
    });

  const { data: funders, refetch: refetchFunders } =
    useReadContract({
      address: FUND_ME_ADDRESS,
      abi: FUND_ME_ABI.abi,
      functionName: "getFunders",
    }) as { data: Address[]; refetch: () => void };

  const { data: owner } = useReadContract({
    address: FUND_ME_ADDRESS,
    abi: FUND_ME_ABI.abi,
    functionName: "getOwner",
  }) as { data: Address };

  const {
    writeContract,
    isPending,
    data: txHash,
  } = useWriteContract();

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  // Effect to refetch data when transaction is confirmed
  useEffect(() => {
    if (isSuccess) {
      refetchBalance();
      refetchFunders();
    }
  }, [isSuccess, refetchBalance, refetchFunders]);

  const handleFund = async () => {
    try {
      await writeContract({
        address: FUND_ME_ADDRESS,
        abi: FUND_ME_ABI.abi,
        functionName: "fund",
        value: parseEther("0.1"),
      });
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleWithdraw = async () => {
    await writeContract({
      address: FUND_ME_ADDRESS,
      abi: FUND_ME_ABI.abi,
      functionName: "withdraw",
    });
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Coffee Mate
          </h1>
          <ConnectButton />
        </div>

        {isConnected && (
          <div className="space-y-6">
            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">
                Buy me a coffee!
              </h2>
              <p className="mb-4">
                Support this project by buying me a coffee
                for 0.1 ETH
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleFund}
                  disabled={isPending || isConfirming}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isPending
                    ? "Sending..."
                    : isConfirming
                    ? "Confirming..."
                    : "Fund 0.1 ETH"}
                </button>
                {owner === address && (
                  <button
                    type="button"
                    disabled={isPending || isConfirming}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    onClick={handleWithdraw}
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>

            <div>
              Balance is: {balance?.value.toString()}
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">
                Funders
              </h2>
              {funders && funders.length > 0 ? (
                <ul className="space-y-2">
                  {funders.map((funder) => (
                    <li key={funder} className="text-sm">
                      {funder}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No funders yet. Be the first one!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
