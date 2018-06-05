import numpy as np
import os
import sklearn.decomposition
import tqdm

class WordVectorUtility:

    def __init__(self, filePath):
        self.wordDict, self.vecMatrix = self.loadVectorFile(filePath )
        self.normMatrix = np.sqrt(np.sum(self.vecMatrix**2,axis=1))
        self.revWordDict = {v: k for k,v in enumerate(self.wordDict)}

    # words = pd.read_table("/Users/cameronfranz/NoSync/glove.6B/glove.840B.300d.txt", sep=" ", index_col=0, header=None, quoting=csv.QUOTE_NONE)
    # loads in approx 3.5 min for 840B300d. below method is approx 3 min AND has a progress bar!
    # dict = {k: v for (k, v) in enumerate(words.index.values)}
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

    def vecIndexesToWords(self, indexes):
        list = np.apply_along_axis(np.vectorize(lambda i: self.wordDict[i]), 0, indexes)
        return list

    def closestWords(self, wordList, num):
        indexes = self.closestVecIndexesToWords(wordList)
        return self.vecIndexesToWords(indexes[:num])

    def basicTest(self):
        indexes = np.random.randint(0, self.vecMatrix.shape[1], 10)
        passed = True
        for i in indexes:
            passed = passed and (self.wordDict[i] == self.wordDict[self.closestVecIndexesToVec(self.vecMatrix[i])[0]])
        return passed


vectorUtil = WordVectorUtility("/Users/cameronfranz/NoSync/glove.6B/glove.6B.50d.txt")
vectorUtil2 = vectorUtil
vectorUtil.basicTest()
#Update instance methods w/o having to remake class -- just REPL new method into global scope first
vectorUtil.basicTest = basicTest.__get__(vectorUtil, WordVectorUtility)
vectorUtil.closestWords = closestWords.__get__(vectorUtil, WordVectorUtility)
vectorUtil.wordDistance = wordDistance.__get__(vectorUtil, WordVectorUtility)
vectorUtil.closestVecIndexesToVec = closestVecIndexesToVec.__get__(vectorUtil, WordVectorUtility)
#300d has significant difference from 50D in e.g. vector addition -- much different. Feel like common crawl or
#twitter would be more fun

vectorUtil.vecIndexesToWords(vectorUtil.closestVecIndexesToWords(["soft", "squishy", "slimy"]))
vectorUtil.closestWords(["soft", "squishy", "slimy"], 15)
vectorUtil.closestWords(["confused"], 15)
vectorUtil.closestWords(["soft", "squishy"], 10)
vectorUtil.closestWords(["quick", "brown", "fox"], 30)
vectorUtil.closestWords(["companies", "programs"], 30) # => "opportunities", which is useful
vectorUtil.closestWords(["sow"], 30)
vectorUtil.closestWords(["bee","movie"], 10)
vectorUtil.closestWords(["computer","tablet"], 15)
vectorUtil.closestWords(["silly","funny"], 15)
vectorUtil.closestWords(["river","ugly","nature"], 15)
vectorUtil.closestWords(["The", "quick", "brown", "fox", "jumped", "over", "the", "lazy", "dog"], 15)
vectorUtil.closestWords(["biostatistician"], 15)
vectorUtil.closestWords(["SpaceX"], 15)
vectorUtil.closestWords(["hungry"], 15)
vectorUtil.closestWords(["atom","bomb"], 15)
vectorUtil.closestWords(["insect","Kafka"], 15)
vectorUtil.closestWords(["brown"], 15)

#can see that if have word/context "forest" and want to replace word "walking", that of these 3 "hiking" is clearly most coherent.
vectorUtil.closestWords(["walking"], 15)
vectorUtil.wordDistance("running","forest")
np.where(vectorUtil.closestWords(["hiking"], 10000) == "forest")
np.where(vectorUtil.closestWords(["walking"], 10000) == "forest")
np.where(vectorUtil.closestWords(["running"], 10000) == "forest")

#seems to be a conbimation of words very similar to walking (e.g. hiking) and words very similar to forest(e.g. park)
for word in (vectorUtil.closestWords(["walking"], 30)):
    print("{:10} dist {:.3}".format(word, vectorUtil.wordDistance("forest", word)))
#hiking and foot are greater similarity than walking. Foot probably needs to be "by foot"

#only using #s 5x faster on 6B.300d. On 840B.300d (2.2M tokens vs 0.4M tokens), is 600ms vs 44.7s
%timeit np.where(vectorUtil.closestWords(["running"], 90000) == "forest")
%timeit np.where(vectorUtil.closestVecIndexesToWords(["running"]) == vectorUtil.revWordDict["forest"])

#Goal: increase coherence in writing

#"Original: The breeze blew through the trees, rustling the leaves"

def AssociationsCloseToTarget(word, target):
    list = []
    associations = vectorUtil.closestWords([word], 30)
    for assoc in associations:
        assocSynStrength = vectorUtil.wordDistance(assoc, word)
        assocTargetStrength = vectorUtil.wordDistance(assoc, target)
        list.append((assoc, round(assocSynStrength, 2), round(assocTargetStrength, 2)))
        # list.append((assoc, round(assocSynStrength + assocTargetStrength, 2)))
    return sorted(list, key=(lambda e: e[2]), reverse=True)
    # return sorted(list, key=(lambda e: e[1]), reverse=True)

#lemmatization matters
AssociationsCloseToTarget("rustled", "leaves")
AssociationsCloseToTarget("rustle", "leaves")
AssociationsCloseToTarget("rustling", "leaves")
AssociationsCloseToTarget("rustle", "trees")
AssociationsCloseToTarget("breeze", "trees")
AssociationsCloseToTarget("breeze", "leaves")

#I barely caught the train that was going to take me to my adventure.
AssociationsCloseToTarget("caught", "train")

#Goal: I was addicted to pirate movies -> I was hooked on pirate movies.
AssociationsCloseToTarget("addicted", "pirate")
#hooked is there, but it is not the closest. I think this means that the close word vectors do not mean that the two things are imagined together.`

AssociationsCloseToTarget("movies", "pirate")

#So question is, can we make a function that increases coherence? E.g. takes in sentences / tweets and returns RELIABLE changes.
#How can we make something that we think is a meaningful tool.
#Most basic w/ just word vectors is to replace words -- with same POS and lemmatization -- and then show a bunch of possibilities. With hope that one is more coherent.
#and let user click on the best one to use as the new input, so in some way it can be evolved.

import spacy
nlp = spacy.load('en_core_web_sm')
text = "The quick brown fox jumped over the lazy dog."
doc = nlp("That")
for token in doc:
    print(token.lemma_, token.pos_)
arr = vectorUtil.closestWords(["leaped"], 100)
idx = np.random.randint(0,100,10)
arr[idx]

# The         : of entire The one that same its first part
# quick       : quick easy fast simple easier quickly hany convient make instant
# brown       : brown gray grey black white beige dark red blue pale
# fox         : fox wolf foxes coyote rabbit beaver hare megan squirrel raccoon
# leaped      : leaped leapt jumped lept lunged sprinted darted leaping sprang scampered
# over        : over up nearly almost around down past out than across
# the         : the of entire The one that same its first part
# lazy        : lazy tired stupid dumb bored silly ignorant lousy selfish lame
# dog         : cat cats kitten dog kitty pet puppy kittens feline dogs

#Could make sort of classifier that tries to evaluate semantically corrtect sentences (training on sentences modified
#by this method) and then eliminate new sentences produced by this method that don't make sense.


#Below is the function I'm using for this first version of the tool.
