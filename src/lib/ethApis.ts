import axios, { AxiosError } from 'axios'

class EthApis {
  private readonly ethApiUrl =
    'https://eth-mainnet.g.alchemy.com/v2/SJqVZ2UR7aN6Egap0f-eIj4ME4iMe_k6'

  private async getResponse(payload: any) {
    try {
      const { data } = await axios.post(this.ethApiUrl, payload)
      return data
    } catch (error) {
      const axiosError = error as AxiosError
      console.error(`Error: ${axiosError.message}`, axiosError.response?.data)
      return null
    }
  }

  public async getBalance(walletAddress: string) {
    const payload = {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getBalance',
      params: [walletAddress, 'latest'],
    }
    return this.getResponse(payload)
  }

  public async getTransaction(signature: string) {
    const payload = {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getTransactionByHash',
      params: [signature],
    }
    return this.getResponse(payload)
  }

  public async getAccountInfo(walletAddress: string) {
    const payload = {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getCode',
      params: [walletAddress, 'latest'],
    }
    return this.getResponse(payload)
  }

  public async getTransactionCount(walletAddress: string) {
    const payload = {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getTransactionCount',
      params: [walletAddress, 'latest'],
    }
    return this.getResponse(payload)
  }

  public async getTransactionsByAccount(walletAddress: string) {
    const payload = {
      jsonrpc: '2.0',
      id: 1,
      method: 'alchemy_getAssetTransfers',
      params: [
        {
          fromBlock: '0x0',
          toBlock: 'latest',
          withMetadata: true,
          excludeZeroValue: true,
          maxCount: '0x64', // Hex for 100
          order: 'desc',
          fromAddress: walletAddress,
          category: ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
        },
      ],
    }

    try {
      const response = await this.getResponse(payload)
      if (!response?.result?.transfers) {
        return []
      }
      const transactionPromises = response.result.transfers
        .slice(0, 10)
        .map((transfer: any, index: number) => this.getTransaction(transfer.hash))
      const transactions = await Promise.all(transactionPromises)

      console.log(transactions)
      const formatedTransaction = transactions.map(function (response) {
        const blockNumber = parseInt(response?.result?.blockNumber, 16)
        const lamportsToEth = (wei: string) => parseInt(wei, 16) / 1e18
        return {
          signature: response?.result?.hash,
          block: blockNumber,
          time: new Date(parseInt(response?.result?.blockNumber, 16) * 1000).toLocaleDateString(),
          instructions: response?.result?.input ? 1 : 0,
          by: response?.result?.from,
          value: lamportsToEth(response?.result?.value),
          fee: lamportsToEth(response?.result?.gasPrice),
        }
      })
      return formatedTransaction
    } catch (error) {
      console.log('Error fetching transactions:', error)
      return []
    }
  }
}

export default new EthApis()
