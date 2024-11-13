import axios from 'axios'

class SolApis {
  solanaApi = 'https://solana-mainnet.g.alchemy.com/v2/SJqVZ2UR7aN6Egap0f-eIj4ME4iMe_k6'

  getResponse = async (payload: any) => {
    try {
      const { data } = await axios.post(this.solanaApi, payload)
      return data
    } catch (error) {
      console.log(error)
    }
  }

  getBalance = async (walletAddress: string) => {
    const payload = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getBalance',
      params: [walletAddress],
    }
    return this.getResponse(payload)
  }

  private getTransactionSignature = async (walletAddress: string) => {
    const payload = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getSignaturesForAddress',
      params: [
        walletAddress,
        {
          limit: 10,
        },
      ],
    }

    return this.getResponse(payload)
  }

  getTransactionDetails = async (signature: string) => {
    const payload = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getTransaction',
      params: [signature, { encoding: 'jsonParsed' }],
    }

    return this.getResponse(payload)
  }

  getTransactionsByAccount = async (walletAddress: string) => {
    const signatures = await this.getTransactionSignature(walletAddress)

    console.log(signatures)

    const transactions1 = await Promise.all(
      signatures.result
        .slice(0, 5)
        .map(async (signature: any) => this.getTransactionDetails(signature.signature)),
    )
    const transactions2 = await Promise.all(
      signatures.result
        .slice(5, 10)
        .map(async (signature: any) => this.getTransactionDetails(signature.signature)),
    )
    return transactions1.concat(transactions2)
  }

  getTransaction = async (signature: string) => {
    const payload = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getTransaction',
      params: [signature],
    }
    return this.getResponse(payload)
  }

  getAccountInfo = async (walletAddress: string) => {
    const payload = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getAccountInfo',
      params: [
        'vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg',
        {
          encoding: 'base58',
        },
      ],
    }

    return this.getResponse(payload)
  }

  getTransactionCount = async (walletAddress: string) => {
    const payload = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getTransactionCount',
      params: [walletAddress],
    }
    return this.getResponse(payload)
  }
}

export default new SolApis()
