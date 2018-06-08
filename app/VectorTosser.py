import numpy as np
import os
import tqdm

class WordVectorUtility:

    def __init__(self, filePath):
        self.wordDict, self.vecMatrix = self.loadVectorFile(filePath )
        self.normMatrix = np.sqrt(np.sum(self.vecMatrix**2,axis=1))
        self.revWordDict = {v: k for k,v in enumerate(self.wordDict)}

    def loadVectorFile(self, filePath):
        print("Getting vector count and dims")
        gFile = open(filePath, encoding="utf-8")
        numVectors = 0
        for line in gFile:
            numVectors += 1
        dims = len(line.split()) - 1

        print("Loading word vectors")
        gFile = open(filePath, encoding="utf-8")
        wordDict = np.empty((numVectors), dtype=object)
        matrix = np.zeros((numVectors, dims))
        for i, line in enumerate(tqdm.tqdm(gFile, total=numVectors)):
            splitIdx = line.find(' ')
            wordDict[i] = line[0:splitIdx]
            matrix[i, :] = np.fromstring(line[splitIdx+1:], count=dims, sep= ' ')
        return (wordDict, matrix)

    def closestVecIndexesToVec(self, vec):
        vecNorm = np.sqrt(np.sum(vec**2))
        distances = np.matmul(self.vecMatrix, vec)
        distances = distances / (vecNorm * self.normMatrix)
        return np.flip(np.argsort(distances),axis=0)

    def wordDistance(self, word1, word2):
        vec1 = self.vecMatrix[self.revWordDict[word1]]
        vec2 = self.vecMatrix[self.revWordDict[word2]]
        dot = np.dot(vec1, vec2)
        normProd = np.sqrt(np.sum(vec1**2)) * np.sqrt(np.sum(vec2**2))
        return (dot/normProd)

    def closestVecIndexesToWords(self, wordList):
        sumVec = np.zeros(self.vecMatrix.shape[1])
        for word in wordList:
            sumVec += self.vecMatrix[self.revWordDict[word]]
        sumVec /= len(wordList)
        list = self.closestVecIndexesToVec(sumVec)
        return list

    def inWordDict(self, word):
        return (word in self.revWordDict.keys())

    def vecIndexesToWords(self, indexes):
        list = np.apply_along_axis(np.vectorize(lambda i: self.wordDict[i]), 0, indexes)
        return list

    def closestWords(self, wordList, num):
        indexes = self.closestVecIndexesToWords(wordList)
        list = self.vecIndexesToWords(indexes[:num + 1])
        for word in wordList:
            list = np.delete(list, np.where(list==word))
        return list

    def basicTest(self):
        indexes = np.random.randint(0, self.vecMatrix.shape[1], 10)
        passed = True
        for i in indexes:
            passed = passed and (self.wordDict[i] == self.wordDict[self.closestVecIndexesToVec(self.vecMatrix[i])[0]])
        return passed

#
# import numpy as np
# a =np.array(["testing","123"])
# np.delete(a, np.where(a=="1234"))
